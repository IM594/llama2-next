import {useState, useEffect} from "react";

import styles from "./settings.module.scss";
import ResetIcon from "../icons/reload.svg";
import CloseIcon from "../icons/close.svg";
import ClearIcon from "../icons/clear.svg";
import {List, ListItem} from "./ui-lib";
import {ModelConfigList} from "./model-config";

import {IconButton} from "./button";
import {
    useChatStore,
    useAppConfig,
} from "../store";

import Locale, {AllLangs, changeLang, getLang} from "../locales";
import {Path} from "../constant";
import {useNavigate} from "react-router-dom";

export function Settings() {
    const navigate = useNavigate();
    const config = useAppConfig();
    const updateConfig = config.update;
    const resetConfig = config.reset;
    const chatStore = useChatStore();

    useEffect(() => {
        const keydownEvent = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                navigate(Path.Home);
            }
        };
        document.addEventListener("keydown", keydownEvent);
        return () => {
            document.removeEventListener("keydown", keydownEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div className="window-header">
                <div className="window-header-title">
                    <div className="window-header-main-title">
                        {Locale.Settings.Title}
                    </div>
                </div>

                <div className="window-actions">
                    <div className="window-action-button">
                        <IconButton
                            icon={<CloseIcon/>}
                            onClick={() => navigate(Path.Home)}
                            bordered
                            title={Locale.Settings.Actions.Close}
                        />
                    </div>
                </div>
            </div>

            <div className={styles["settings"]}>
                <List>

                    <ListItem title={Locale.Settings.Lang.Name}>
                        <select
                            value={getLang()}
                            onChange={(e) => {
                                changeLang(e.target.value as any);
                            }}
                        >
                            {AllLangs.map((lang) => (
                                <option value={lang} key={lang}>
                                    {Locale.Settings.Lang.Options[lang]}
                                </option>
                            ))}
                        </select>
                    </ListItem>
                </List>

                <List>
                    <ModelConfigList
                        modelConfig={config.modelConfig}
                        updateConfig={(upater) => {
                            const modelConfig = {...config.modelConfig};
                            upater(modelConfig);
                            config.update((config) => (config.modelConfig = modelConfig));
                        }}
                    />
                </List>

                <List>
                    <ListItem
                        title={"Clear All Data"}
                    >
                        <div className={styles["window-action-button"]}>
                            <IconButton
                                icon={<ClearIcon/>}
                                onClick={() => {
                                    if (confirm(Locale.Settings.Actions.ConfirmClearAll)) {
                                        chatStore.clearAllData();
                                    }
                                }}
                                bordered
                                title={Locale.Settings.Actions.ClearAll}
                            />
                        </div>
                    </ListItem>

                    <ListItem
                        title={"Reset All Settings"}
                    >
                        <div className={styles["window-action-button"]}>
                            <IconButton
                                icon={<ResetIcon/>}
                                onClick={() => {
                                    if (confirm(Locale.Settings.Actions.ConfirmResetAll)) {
                                        resetConfig();
                                    }
                                }}
                                bordered
                                title={Locale.Settings.Actions.ResetAll}
                            />
                        </div>
                    </ListItem>
                </List>
            </div>
        </div>
    );
}
