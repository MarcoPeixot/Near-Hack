// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// Interface para zkVerify
interface IZkVerify {
    function verify(bytes calldata proof, bytes calldata publicInputs) external view returns (bool);
}

contract AcademicMeritNFT is ERC721URIStorage, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    uint256 public tokenIdCounter;
    IZkVerify public zkVerifier;

    constructor(address zkVerifierAddress) ERC721("Academic Merit", "MERIT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        zkVerifier = IZkVerify(zkVerifierAddress);
    }

    function mintWithProof(
        address student,
        bytes calldata proof,
        bytes calldata publicInputs,
        string calldata tokenURI
    ) external onlyRole(ISSUER_ROLE) {
        require(zkVerifier.verify(proof, publicInputs), "Invalid zero-knowledge proof");

        uint256 newId = tokenIdCounter++;
        _mint(student, newId);
        _setTokenURI(newId, tokenURI);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}
