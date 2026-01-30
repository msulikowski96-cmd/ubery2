import React, { useEffect } from "react";
import { AppRegistry } from "react-native";
import { CarPlay, ListTemplate } from "react-native-carplay";

interface MenuItem {
  text: string;
  detailText?: string;
}

interface Section {
  header: string;
  items: MenuItem[];
}

function initAndroidAuto() {
  CarPlay.registerOnConnect(() => {
    console.log("Android Auto connected");

    const mainTemplate = new ListTemplate({
      sections: [
        {
          header: "RideCalc Pro",
          items: [
            { text: "Dashboard", detailText: "View your earnings" },
            { text: "New Trip", detailText: "Start a new trip" },
            { text: "History", detailText: "View past trips" },
            { text: "Settings", detailText: "App settings" },
          ],
        },
        {
          header: "Quick Actions",
          items: [
            { text: "Start Tracking", detailText: "Begin trip tracking" },
            { text: "Stop Tracking", detailText: "End current trip" },
          ],
        },
      ] as Section[],
      title: "RideCalc Pro",
      async onItemSelect(item: { index: number }) {
        console.log("Selected item:", item);
        switch (item.index) {
          case 0:
            showDashboard();
            break;
          case 1:
            showNewTrip();
            break;
          case 2:
            showHistory();
            break;
          case 3:
            showSettings();
            break;
          default:
            break;
        }
      },
    });

    CarPlay.setRootTemplate(mainTemplate);
  });

  CarPlay.registerOnDisconnect(() => {
    console.log("Android Auto disconnected");
  });
}

function showDashboard() {
  const dashboardTemplate = new ListTemplate({
    sections: [
      {
        header: "Today's Summary",
        items: [
          { text: "Total Earnings", detailText: "$0.00" },
          { text: "Trips Completed", detailText: "0" },
          { text: "Hours Worked", detailText: "0h 0m" },
          { text: "Distance Driven", detailText: "0.0 km" },
        ],
      },
    ] as Section[],
    title: "Dashboard",
    backButtonHidden: false,
  });

  CarPlay.pushTemplate(dashboardTemplate);
}

function showNewTrip() {
  const newTripTemplate = new ListTemplate({
    sections: [
      {
        header: "Start New Trip",
        items: [
          { text: "Select Platform", detailText: "Choose ride platform" },
          { text: "Start Trip", detailText: "Begin tracking" },
        ],
      },
    ] as Section[],
    title: "New Trip",
    backButtonHidden: false,
  });

  CarPlay.pushTemplate(newTripTemplate);
}

function showHistory() {
  const historyTemplate = new ListTemplate({
    sections: [
      {
        header: "Recent Trips",
        items: [
          { text: "No trips yet", detailText: "Start your first trip" },
        ],
      },
    ] as Section[],
    title: "Trip History",
    backButtonHidden: false,
  });

  CarPlay.pushTemplate(historyTemplate);
}

function showSettings() {
  const settingsTemplate = new ListTemplate({
    sections: [
      {
        header: "Settings",
        items: [
          { text: "Units", detailText: "Kilometers" },
          { text: "Currency", detailText: "USD" },
          { text: "Theme", detailText: "Auto" },
        ],
      },
    ] as Section[],
    title: "Settings",
    backButtonHidden: false,
  });

  CarPlay.pushTemplate(settingsTemplate);
}

export default function AndroidAutoApp() {
  useEffect(() => {
    initAndroidAuto();
  }, []);

  return null;
}

export function registerAndroidAuto() {
  initAndroidAuto();
}
