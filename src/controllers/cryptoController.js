import Crypto from "../models/Crypto.js";

export async function getAllCrypto(req, res, next) {
  try {
    const data = await Crypto.find().sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

export async function getTopGainers(req, res, next) {
  try {
    const data = await Crypto.find({ change24h: { $gt: 0 } }).sort({ change24h: -1 });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

export async function getNewListings(req, res, next) {
  try {
    const data = await Crypto.find().sort({ createdAt: -1 });
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

export async function createCrypto(req, res, next) {
  try {
    const {
      name,
      symbol,
      price,
      image,
      change24h,
      change,
      change_24h,
      "24hChange": raw24hChange,
    } = req.body;

    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedSymbol = typeof symbol === "string" ? symbol.trim().toUpperCase() : "";
    const normalizedImage = typeof image === "string" ? image.trim() : "";
    const resolvedChange = change24h ?? change ?? change_24h ?? raw24hChange;
    const numericPrice = Number(price);
    const numericChange = Number(resolvedChange);

    if (
      !normalizedName ||
      !normalizedSymbol ||
      !normalizedImage ||
      Number.isNaN(numericPrice) ||
      Number.isNaN(numericChange)
    ) {
      return res.status(400).json({
        message: "name, symbol, price, image, and change24h are required with valid values.",
      });
    }

    const created = await Crypto.create({
      name: normalizedName,
      symbol: normalizedSymbol,
      price: numericPrice,
      image: normalizedImage,
      change24h: numericChange,
    });

    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}
