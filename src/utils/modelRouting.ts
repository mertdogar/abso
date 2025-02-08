import { IProvider } from "../types";

/**
 * Simple helper to find the first provider that returns true for matchesModel.
 */
export function findMatchingProvider(
  model: string,
  providers: IProvider[]
): IProvider | undefined {
  return providers.find((provider) => provider.matchesModel(model));
}
