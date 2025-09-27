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
        bool verified;
        bool verificationRequestedFlag;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    string public verifiedBadgeURI = "ipfs://QmVerifiedBadge";

    event CampaignVerificationRequested(uint256 campaignId, address owner);
    event CampaignVerified(uint256 campaignId, address owner);

    // [No changes in this section]
    function requestVerification(uint256 _id) public { /* ... */ }
    function verifyCampaign(uint256 _id) public { /* ... */ }
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override { /* ... */ }

    // -----------------------------
    // CAMPAIGN MANAGEMENT & BUGS
    // -----------------------------

    /**
     * @notice Create a new campaign
     * @dev BUG #1 (Access Control): Anyone can create a campaign for any address
     * by passing a different `_owner`. `msg.sender` should be used instead.
     */
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner; // <-- BUG! Should be msg.sender
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.active = true;
        campaign.verified = false;
        campaign.verificationRequestedFlag = false;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    /**
     * @notice Donate to a campaign
     * @dev BUG #2 (Timestamp Dependence): Miners can manipulate block.timestamp,
     * which could allow a donation after the intended deadline.
     */
    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp < campaign.deadline, "Campaign has ended"); // <-- BUG!
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        campaign.amountCollected += msg.value;
    }

    /**
     * @notice Withdraw funds from a successful campaign
     * @dev BUG #3 (Reentrancy): The state `amountCollected` is updated AFTER the
     * external call. An attacker's contract could repeatedly call this function
     * to drain the contract's balance before the amount is set to zero.
     */
    function withdrawFunds(uint256 _id) public {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Not the owner");
        require(block.timestamp >= campaign.deadline, "Campaign still active");
        require(campaign.amountCollected > 0, "No funds to withdraw");

        uint256 amountToWithdraw = campaign.amountCollected;

        // The external call is made BEFORE updating the state (The Bug!)
        (bool success, ) = payable(campaign.owner).call{value: amountToWithdraw}("");
        require(success, "Transfer failed");

        // State is updated AFTER the call, opening the door for reentrancy
        campaign.amountCollected = 0;
    }

    /**
     * @notice Cancel a campaign
     * @dev BUG #4 (Access Control): There is no check for `msg.sender`.
     * Anyone can call this function and cancel any active campaign.
     */
    function cancelCampaign(uint256 _id) public {
        campaigns[_id].active = false; // <-- BUG! No authorization check.
    }

    /**
     * @notice Get all campaigns
     * @dev BUG #5 (Denial of Service): If `numberOfCampaigns` becomes very large,
     * the gas cost to execute this loop could exceed the block gas limit,
     * making this function impossible to call.
     */
    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i < numberOfCampaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    // [No changes in the remaining functions]
    function getUserCampaigns(address _user) public view returns (Campaign[] memory) { /* ... */ }
    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) { /* ... */ }
}