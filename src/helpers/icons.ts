import bitcoin from "../assets/icons/bitcoin.webp";
import ethereum from "../assets/icons/ethereum.webp";
import binancecoin from "../assets/icons/binance-coin-logo.webp";
import cardano from "../assets/icons/cardano.webp";
import solana from "../assets/icons/solana.webp";
import ripple from "../assets/icons/xrp-symbol-white-128.webp";
import polkadot from "../assets/icons/polkadot.webp";
import dogecoin from "../assets/icons/dogecoin.webp";
import litecoin from "../assets/icons/litecoin.webp";
import chainlink from "../assets/icons/chainlink-new-logo.webp";

export const assetIcons: Record<string, string> = {
  bitcoin,
  ethereum,
  binancecoin,
  cardano,
  solana,
  ripple,
  polkadot,
  dogecoin,
  litecoin,
  chainlink,
};

export const getAssetIcon = (id: string): string | undefined => {
  return assetIcons[id.toLowerCase()];
};
