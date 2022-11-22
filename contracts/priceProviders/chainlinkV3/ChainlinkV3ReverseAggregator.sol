// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainlinkV3ReverseAggregator is AggregatorV3Interface {
    // solhint-disable-next-line var-name-mixedcase
    AggregatorV3Interface private immutable _AGGREGATOR;
    // solhint-disable-next-line var-name-mixedcase
    uint256 private immutable _PRICE_NUMERATOR;

    uint8 public immutable decimals;

    constructor(AggregatorV3Interface _aggregator) {
        _AGGREGATOR = _aggregator;
        decimals = _aggregator.decimals();
        _PRICE_NUMERATOR = 10 ** (uint256(decimals) * 2);
    }


    function description() external view returns (string memory) {
        return _AGGREGATOR.description();
    }

    function version() external view returns (uint256) {
        return _AGGREGATOR.version();
    }

    function getRoundData(uint80 _roundId)
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        (roundId, answer, startedAt, updatedAt, answeredInRound) = _AGGREGATOR.getRoundData(_roundId);
        answer = _reverse(answer);
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        (roundId, answer, startedAt, updatedAt, answeredInRound) = _AGGREGATOR.latestRoundData();
        answer = _reverse(answer);
    }

    function _reverse(int256 price) private view returns(int256) {
        if (price <= 0) {
            return 0;
        }

        // We return the inverse price, with same precision as current price
        return int256(_PRICE_NUMERATOR / uint256(price));
    }
}