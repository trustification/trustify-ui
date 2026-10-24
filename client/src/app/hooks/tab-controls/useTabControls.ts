import type { DisallowCharacters } from "@app/utils/type-utils";

import type {
  TabContentProps,
  TabProps,
  TabsProps,
} from "@patternfly/react-core";
import type { PersistTarget } from "../table-controls";
import { getTabDerivedState } from "./getTabDerivedState";
import { type ITabStateArgs, useTabState } from "./useTabState";

type ICommonPersistenceArgs<TPersistenceKeyPrefix extends string = string> = {
  persistenceKeyPrefix?: DisallowCharacters<TPersistenceKeyPrefix, ":">;
  persistTo?: PersistTarget;
};

type IUseTabControlsArgs<
  TTabKey extends string,
  TPersistenceKeyPrefix extends string = string,
> = ITabStateArgs<TTabKey> & ICommonPersistenceArgs<TPersistenceKeyPrefix>;

export const useTabControls = <TTabKey extends string>(
  args: IUseTabControlsArgs<TTabKey>,
) => {
  const state = useTabState(args);
  const derivedState = getTabDerivedState({ tabState: state });

  const getTabId = (tabKey: TTabKey) => {
    return `${tabKey}-tab-section`;
  };

  const getTabsProps = (): Pick<TabsProps, "activeKey" | "onSelect"> => ({
    activeKey: state.activeTab?.tabKey,
    onSelect: (_e, tabKey) => {
      derivedState.setActiveTab(tabKey as TTabKey);
    },
  });

  const getTabProps = (
    tabKey: TTabKey,
  ): Pick<TabProps, "eventKey" | "tabContentId"> => ({
    eventKey: tabKey,
    tabContentId: getTabId(tabKey),
  });

  const getTabContentProps = (
    tabKey: TTabKey,
  ): Pick<TabContentProps, "id" | "eventKey" | "hidden"> => ({
    id: getTabId(tabKey),
    eventKey: tabKey,
    hidden: !derivedState.isTabActive(tabKey),
  });

  return {
    ...args,
    state,
    derivedState,
    propHelpers: {
      getTabsProps,
      getTabProps,
      getTabContentProps,
    },
  };
};
