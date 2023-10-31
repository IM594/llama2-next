import { useEffect, useRef } from "react";

import styles from "./home.module.scss";

import { IconButton } from "./button";
import SettingsIcon from "../icons/settings.svg";
import AddIcon from "../icons/add.svg";
import CloseIcon from "../icons/close.svg";
import DeleteIcon from "../icons/delete.svg";
import MaskIcon from "../icons/mask.svg";

import Locale from "../locales";

import { Theme, useAppConfig, useChatStore } from "../store";

import {
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  NARROW_SIDEBAR_WIDTH,
  Path,
  // REPO_URL,
} from "../constant";

import { Link, useNavigate } from "react-router-dom";
import { useMobileScreen } from "../utils";
import dynamic from "next/dynamic";
import { showToast } from "./ui-lib";
import chatStyle from "@/app/components/chat.module.scss";
import AutoIcon from "@/app/icons/auto.svg";
import LightIcon from "@/app/icons/light.svg";
import DarkIcon from "@/app/icons/dark.svg";

const ChatList = dynamic(async () => (await import("./chat-list")).ChatList, {
  loading: () => null,
});

function useDragSideBar() {
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x);

  const config = useAppConfig();
  const startX = useRef(0);
  const startDragWidth = useRef(config.sidebarWidth ?? 300);
  const lastUpdateTime = useRef(Date.now());

  const handleMouseMove = useRef((e: MouseEvent) => {
    if (Date.now() < lastUpdateTime.current + 50) {
      return;
    }
    lastUpdateTime.current = Date.now();
    const d = e.clientX - startX.current;
    const nextWidth = limit(startDragWidth.current + d);
    config.update((config) => (config.sidebarWidth = nextWidth));
  });

  const handleMouseUp = useRef(() => {
    startDragWidth.current = config.sidebarWidth ?? 300;
    window.removeEventListener("mousemove", handleMouseMove.current);
    window.removeEventListener("mouseup", handleMouseUp.current);
  });

  const onDragMouseDown = (e: MouseEvent) => {
    startX.current = e.clientX;

    window.addEventListener("mousemove", handleMouseMove.current);
    window.addEventListener("mouseup", handleMouseUp.current);
  };
  const isMobileScreen = useMobileScreen();
  const shouldNarrow =
    !isMobileScreen && config.sidebarWidth < MIN_SIDEBAR_WIDTH;

  useEffect(() => {
    const barWidth = shouldNarrow
      ? NARROW_SIDEBAR_WIDTH
      : limit(config.sidebarWidth ?? 300);
    const sideBarWidth = isMobileScreen ? "100vw" : `${barWidth}px`;
    document.documentElement.style.setProperty("--sidebar-width", sideBarWidth);
  }, [config.sidebarWidth, isMobileScreen, shouldNarrow]);

  return {
    onDragMouseDown,
    shouldNarrow,
  };
}

export function SideBar(props: { className?: string }) {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragMouseDown, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();

  const config = useAppConfig();

  // switch themes
  const theme = config.theme;

  function nextTheme() {
    const themes = [Theme.Auto, Theme.Light, Theme.Dark];
    const themeIndex = themes.indexOf(theme);
    const nextIndex = (themeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    config.update((config) => (config.theme = nextTheme));
  }

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${
        shouldNarrow && styles["narrow-sidebar"]
      }`}
    >
      {/*<div className={styles["sidebar-header"]}>*/}
      {/*  /!*<div className={styles["sidebar-title"]}>ChatGPT Next</div>*!/*/}
      {/*  /!*<div className={styles["sidebar-sub-title"]}>*!/*/}
      {/*  /!*    Build your own AI assistant.*!/*/}
      {/*  /!*</div>*!/*/}
      {/*  /!*<div className={styles["sidebar-logo"] + " no-dark"}>*!/*/}
      {/*  /!*    <ChatGptIcon/>*!/*/}
      {/*  /!*</div>*!/*/}
      {/*  <div>*/}
      {/*    <IconButton*/}
      {/*      className={styles["width-50"]}*/}
      {/*      icon={<AddIcon />}*/}
      {/*      text={shouldNarrow ? undefined : Locale.Home.NewChat}*/}
      {/*      onClick={() => {*/}
      {/*        if (config.dontShowMaskSplashScreen) {*/}
      {/*          chatStore.newSession();*/}
      {/*          navigate(Path.Chat);*/}
      {/*        } else {*/}
      {/*          navigate(Path.NewChat);*/}
      {/*        }*/}
      {/*      }}*/}
      {/*      shadow*/}
      {/*    />*/}

      {/*    <IconButton*/}
      {/*        className={styles["width-50"]}*/}
      {/*        icon={<AddIcon />}*/}
      {/*        text={shouldNarrow ? undefined : Locale.Home.NewChat}*/}
      {/*        onClick={() => {*/}
      {/*          chatStore.newSession();*/}
      {/*          navigate(Path.Chat);}}*/}
      {/*        shadow*/}
      {/*    />*/}
      {/*  </div>*/}

      {/*</div>*/}

      <div className={styles["sidebar-header-bar"]}>

        <IconButton
            icon={<AddIcon />}
            className={styles["sidebar-bar-button"]}
            text={shouldNarrow ? undefined : Locale.Home.NewChat}
            onClick={() => {
              chatStore.newSession();
              navigate(Path.Chat);}}

            shadow
        />

        <IconButton
            icon={<MaskIcon />}
            className={styles["sidebar-bar-button"]}
            text={shouldNarrow ? undefined : Locale.Home.MaskChat}
            onClick={() => {
              if (config.dontShowMaskSplashScreen) {
                chatStore.newSession();
                navigate(Path.Chat);
              } else {
                navigate(Path.MaskChat);
              }
            }}
            shadow
        />
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"]}>
              <IconButton icon={<SettingsIcon />}
                          shadow
                          text={"Settings"}
                          onClick={() => {  navigate(Path.Settings);}}
              />
          </div>

          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => {
                if (confirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>

          {/*<div className={styles["sidebar-action"]}>*/}
          {/*  <a href={REPO_URL} target="_blank">*/}
          {/*    <IconButton icon={<GithubIcon />} shadow />*/}
          {/*  </a>*/}
          {/*</div>*/}
        </div>
        <div className={styles["sidebar-actions"]} onClick={nextTheme}>
          {theme === Theme.Auto ? (
            <IconButton icon={<AutoIcon />} shadow
                        text={"Themes"}

            />
          ) : theme === Theme.Light ? (
            <IconButton icon={<LightIcon />} shadow
                        text={"Themes"}
            />
          ) : theme === Theme.Dark ? (
            <IconButton icon={<DarkIcon />} shadow
                        text={"Themes"}
            />
          ) : null}
        </div>
        {/*<div>*/}
        {/*    <IconButton*/}
        {/*        icon={<AddIcon/>}*/}
        {/*        text={shouldNarrow ? undefined : Locale.Home.NewChat}*/}
        {/*        onClick={() => {*/}
        {/*            if (config.dontShowMaskSplashScreen) {*/}
        {/*                chatStore.newSession();*/}
        {/*                navigate(Path.Chat);*/}
        {/*            } else {*/}
        {/*                navigate(Path.NewChat);*/}
        {/*            }*/}
        {/*        }}*/}
        {/*        shadow*/}
        {/*    />*/}
        {/*</div>*/}
      </div>

      <div
        className={styles["sidebar-drag"]}
        onMouseDown={(e) => onDragMouseDown(e as any)}
      ></div>
    </div>
  );
}
