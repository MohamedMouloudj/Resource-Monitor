import { describe, expect, it, Mock, vi } from "vitest";
import { createTray } from "../../src/electron/tray.js";
import { app, BrowserWindow, Menu } from "electron";

vi.mock("electron", () => ({
  Tray: vi.fn().mockReturnValue({
    setContextMenu: vi.fn(),
    setToolTip: vi.fn(),
  }),
  app: {
    getAppPath: vi.fn().mockReturnValue("/"),
    quit: vi.fn(),
  },
  Menu: {
    buildFromTemplate: vi.fn().mockReturnValue({
      items: [
        { type: "normal", label: " Show " },
        { type: "separator" },
        { type: "normal", label: " Quit " },
      ],
    }),
  },
}));

const mainwindow = {
  show: vi.fn(),
} satisfies Partial<BrowserWindow> as any as BrowserWindow;

describe("tray test", () => {
  it("should create tray with correct menu items", () => {
    createTray(mainwindow);
    expect(Menu.buildFromTemplate).toHaveBeenCalled();
    const call = (Menu.buildFromTemplate as any as Mock).mock.calls;
    const args = call[0] as Parameters<typeof Menu.buildFromTemplate>;

    const template = args[0];
    expect(template).toHaveLength(3);
  });
  it("should show mainwindow when show tray is clicked and quit when quit is clicked", () => {
    createTray(mainwindow);
    const call = (Menu.buildFromTemplate as any as Mock).mock.calls;
    const args = call[0] as Parameters<typeof Menu.buildFromTemplate>;
    const template = args[0];

    template[0]?.click?.(null as any, null as any, null as any);
    expect(mainwindow.show).toHaveBeenCalled();

    template[2]?.click?.(null as any, null as any, null as any);
    expect(app.quit).toHaveBeenCalled();
  });
});
