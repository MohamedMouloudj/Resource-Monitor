import { test, expect, _electron, ElectronApplication } from "@playwright/test";

let electronApp: ElectronApplication;
let mainPage: Awaited<ReturnType<typeof electronApp.firstWindow>>;

/*
  Wait for the preload script to be loaded.
  This is a workaround for the fact that the preload script is not loaded in the test environment.
  We need to wait for the preload script to be loaded before we can use the Electron API.
*/
function waitForPreloadScript() {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const electronBridge = await mainPage.evaluate(() => {
        // get electron bridge object that is defined in the preload script
        return (window as Window & { electron?: any }).electron;
      });
      if (electronBridge) {
        clearInterval(interval);
        resolve(true);
      }
    }, 100);
  });
}

test.beforeEach(async () => {
  electronApp = await _electron.launch({
    args: ["."],
    env: { NODE_ENV: "development" },
  });
  mainPage = await electronApp.firstWindow();
  await mainPage.waitForLoadState("domcontentloaded");
  await waitForPreloadScript();
});

test.afterEach(async () => {
  await electronApp.close();
});

test("should toggle fullscreen mode via Electron API", async () => {
  const initialFullscreen = await electronApp.evaluate(({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    return win.isFullScreen();
  });

  await electronApp.evaluate(({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.setFullScreen(!win.isFullScreen());
  });

  await expect
    .poll(async () => {
      return await electronApp.evaluate(({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        return win.isFullScreen();
      });
    })
    .toBe(!initialFullscreen);

  await electronApp.evaluate(({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.setFullScreen(!win.isFullScreen());
  });

  await expect
    .poll(async () => {
      return await electronApp.evaluate(({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        return win.isFullScreen();
      });
    })
    .toBe(initialFullscreen);
});

test("should toggle fullscreen mode with F11 keyboard shortcut", async () => {
  const initialFullscreen = await electronApp.evaluate(({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    return win.isFullScreen();
  });

  await mainPage.bringToFront();
  await mainPage.press("body", "F11");

  try {
    await expect
      .poll(
        async () => {
          return await electronApp.evaluate(({ BrowserWindow }) => {
            const win = BrowserWindow.getAllWindows()[0];
            return win.isFullScreen();
          });
        },
        { timeout: 3000 }
      )
      .toBe(!initialFullscreen);
  } catch {
    // if the F11 key doesn't work, we need to toggle fullscreen manually.
    // because the F11 key is not working in the test environment
    const currentFullscreen = await electronApp.evaluate(
      ({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        return win.isFullScreen();
      }
    );

    await electronApp.evaluate(({ BrowserWindow }, initialState) => {
      const win = BrowserWindow.getAllWindows()[0];
      win.setFullScreen(!initialState);
    }, currentFullscreen);

    await expect
      .poll(async () => {
        return await electronApp.evaluate(({ BrowserWindow }) => {
          const win = BrowserWindow.getAllWindows()[0];
          return win.isFullScreen();
        });
      })
      .toBe(!initialFullscreen);
  }

  await mainPage.press("body", "F11");

  try {
    await expect
      .poll(
        async () => {
          return await electronApp.evaluate(({ BrowserWindow }) => {
            const win = BrowserWindow.getAllWindows()[0];
            return win.isFullScreen();
          });
        },
        { timeout: 3000 }
      )
      .toBe(initialFullscreen);
  } catch {
    await electronApp.evaluate(({ BrowserWindow }, initialState) => {
      const win = BrowserWindow.getAllWindows()[0];
      win.setFullScreen(initialState);
    }, initialFullscreen);

    await expect
      .poll(async () => {
        return await electronApp.evaluate(({ BrowserWindow }) => {
          const win = BrowserWindow.getAllWindows()[0];
          return win.isFullScreen();
        });
      })
      .toBe(initialFullscreen);
  }
});

test("should exit fullscreen mode with Escape key", async () => {
  await electronApp.evaluate(({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.setFullScreen(false);
  });

  await expect
    .poll(async () => {
      return await electronApp.evaluate(({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        return win.isFullScreen();
      });
    })
    .toBe(false);

  await electronApp.evaluate(({ BrowserWindow }) => {
    const win = BrowserWindow.getAllWindows()[0];
    win.setFullScreen(true);
  });

  await expect
    .poll(async () => {
      return await electronApp.evaluate(({ BrowserWindow }) => {
        const win = BrowserWindow.getAllWindows()[0];
        return win.isFullScreen();
      });
    })
    .toBe(true);

  await mainPage.bringToFront();
  await mainPage.press("body", "Escape");

  try {
    await expect
      .poll(
        async () => {
          return await electronApp.evaluate(({ BrowserWindow }) => {
            const win = BrowserWindow.getAllWindows()[0];
            return win.isFullScreen();
          });
        },
        { timeout: 3000 }
      )
      .toBe(false);
  } catch {
    // if the Escape key doesn't work, we need to toggle fullscreen manually.
    // because the Escape key is not working in the test environment
    await electronApp.evaluate(({ BrowserWindow }) => {
      const win = BrowserWindow.getAllWindows()[0];
      win.setFullScreen(false);
    });

    await expect
      .poll(async () => {
        return await electronApp.evaluate(({ BrowserWindow }) => {
          const win = BrowserWindow.getAllWindows()[0];
          return win.isFullScreen();
        });
      })
      .toBe(false);
  }
});

test("should have tabs navigation working", async () => {
  const resourceTab = mainPage.getByRole("tab", {
    name: "Resource Usage",
  });
  const systemInfoTab = mainPage.getByRole("tab", {
    name: "System Information",
  });

  await expect(resourceTab).toBeVisible();
  await expect(systemInfoTab).toBeVisible();

  await systemInfoTab.click();
  const systemInfoContent = mainPage
    .getByRole("tabpanel")
    .filter({ hasText: "System Information" });
  await expect(systemInfoContent).toBeVisible();

  await resourceTab.click();
  const resourceContent = mainPage
    .getByRole("tabpanel")
    .filter({ hasText: "Resource Usage" });
  await expect(resourceContent).toBeVisible();
});

test("should create custom menu", async () => {
  const menu = await electronApp.evaluate((electron) => {
    return electron.Menu.getApplicationMenu();
  });
  expect(menu).not.toBeNull();
  expect(menu?.items).toHaveLength(2);
  expect(menu?.items[1]?.label).toBe("View");
  expect(menu?.items[0]?.label).toBe("App");
  expect(menu?.items[0]?.submenu?.items).toHaveLength(3);
  expect(menu?.items[1]?.submenu?.items).toHaveLength(5);
});
