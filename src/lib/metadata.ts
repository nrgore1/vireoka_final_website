import type { Metadata } from "next";
import { siteUrl } from "./site";

export function baseMetadata(partial?: Metadata): Metadata {
  return {
    metadataBase: siteUrl(),
    ...partial,
  };
}
