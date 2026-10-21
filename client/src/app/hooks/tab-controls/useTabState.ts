import { usePersistentState } from "@app/hooks/usePersistentState";
import {
  type IFeaturePersistenceArgs,
  isPersistenceProvider,
} from "../table-controls";

export interface IActiveTab<TTabKey extends string> {
  tabKey: TTabKey;
}

export interface ITabState<TTabKey extends string> {
  activeTab: IActiveTab<TTabKey> | null;
  setActiveTab: (tab: IActiveTab<TTabKey>) => void;
}

export type ITabStateArgs<TTabKey extends string> = {
  tabKeys: TTabKey[];
  defaultActiveTab?: IActiveTab<TTabKey>;
};

export const useTabState = <
  TTabKey extends string,
  TPersistenceKeyPrefix extends string = string,
>(
  args: ITabStateArgs<TTabKey> & IFeaturePersistenceArgs<TPersistenceKeyPrefix>,
): ITabState<TTabKey> => {
  const { persistTo = "state", persistenceKeyPrefix } = args;
  const firstTabKey = args.tabKeys[0];
  // Falls back to null (rather than a tab with an undefined key) when tabKeys is
  // empty; ITabState already models "no active tab" as null.
  const defaultActiveTab: IActiveTab<TTabKey> | null =
    args.defaultActiveTab ??
    (firstTabKey !== undefined ? { tabKey: firstTabKey } : null);

  const [activeTab, setActiveTab] = usePersistentState<
    IActiveTab<TTabKey> | null,
    TPersistenceKeyPrefix,
    "activeTab"
  >({
    isEnabled: true,
    defaultValue: defaultActiveTab,
    persistenceKeyPrefix,
    ...(persistTo === "urlParams"
      ? {
          persistTo,
          keys: ["activeTab"],
          serialize: (activeTab: Partial<IActiveTab<TTabKey> | null>) => ({
            activeTab: activeTab?.tabKey || null,
          }),
          deserialize: (urlParams) =>
            urlParams.activeTab
              ? {
                  tabKey: urlParams.activeTab as TTabKey,
                }
              : null,
        }
      : persistTo === "localStorage" || persistTo === "sessionStorage"
        ? {
            persistTo,
            key: "tab",
          }
        : isPersistenceProvider(persistTo)
          ? {
              persistTo: "provider",
              serialize: persistTo.write,
              deserialize: () => persistTo.read() as IActiveTab<TTabKey> | null,
            }
          : { persistTo: "state" }),
  });
  return { activeTab, setActiveTab };
};
