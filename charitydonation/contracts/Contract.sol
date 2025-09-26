// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CharityDonation is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address public admin;

    constructor() ERC721("CharityDonorBadge", "CDB") {
        admin = msg.sender;
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        bool active;
        bool verified;              // ✅ Added
        bool verificationRequestedFlag; // ✅ Added
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    string public verifiedBadgeURI = "ipfs://QmVerifiedBadge";

    event CampaignVerificationRequested(uint256 campaignId, address owner);
    event CampaignVerified(uint256 campaignId, address owner);

    // -----------------------------
    // VERIFICATION
    // -----------------------------

    /// @notice Campaign creator can request verification
    function requestVerification(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only owner can request verification");
        require(!campaign.verificationRequestedFlag, "Verification already requested");
        require(!campaign.verified, "Already verified");

        campaign.verificationRequestedFlag = true;

        emit CampaignVerificationRequested(_id, msg.sender);
    }

    /// @notice Admin approves and verifies campaign
    function verifyCampaign(uint256 _id) public {
        require(msg.sender == admin, "Only admin can verify campaigns");
        Campaign storage campaign = campaigns[_id];
        require(campaign.verificationRequestedFlag, "Verification not requested");
        require(!campaign.verified, "Already verified");

        campaign.verified = true;

        // Mint soulbound NFT badge to the campaign owner
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(campaign.owner, newItemId);
        _setTokenURI(newItemId, verifiedBadgeURI);

        emit CampaignVerified(_id, campaign.owner);
    }

    /// @notice Override transfer to block NFT transfers (SBT)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(
            from == address(0) || to == address(0),
            "Soulbound: Transfer not allowed"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // -----------------------------
    // CAMPAIGN MANAGEMENT
    // -----------------------------

    /// @notice Create a new campaign
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.active = true;
        campaign.verified = false;                 // ✅ Initialize
        campaign.verificationRequestedFlag = false; // ✅ Initialize

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    /// @notice Donate to a campaign
    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountCollected += msg.value;
    }

    /// @notice Get all campaigns
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    /// @notice Get campaigns created by a specific user
    function getUserCampaigns(address _user) public view returns (Campaign[] memory) {
        uint256 count = 0;

        // Count campaigns for sizing array
        for (uint i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].owner == _user) count++;
        }

        Campaign[] memory result = new Campaign[](count);
        uint256 index = 0;
        for (uint i = 0; i < numberOfCampaigns; i++) {
            if (campaigns[i].owner == _user) {
                result[index] = campaigns[i];
                index++;
            }
        }

        return result;
    }

    /// @notice Get donations for a campaign
    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_id];
        return (campaign.donators, campaign.donations);
    }
}
