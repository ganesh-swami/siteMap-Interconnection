'use client';

import PropTypes from 'prop-types';
// import isEqual from 'lodash/isEqual';
import { useEffect, useMemo, useCallback, useState } from 'react';
// hooks
import { useLocalStorage } from 'src/hooks/use-local-storage';
// utils
import { localStorageGetItem } from 'src/utils/storage-available';
//
import { SettingsContext } from './settings-context';

// ----------------------------------------------------------------------

export function SettingsProvider({ children, defaultSettings }) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const [settings, setSettings] = useLocalStorage('settings', defaultSettings);

  const isArabic = localStorageGetItem('i18nextLng') === 'ar';

  useEffect(() => {
    if (isArabic) {
      onChangeDirectionByLang('ar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  const onUpdate = useCallback(
    (name, value) => {
      setSettings((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setSettings]
  );

  // Direction by lang
  const onChangeDirectionByLang = useCallback(
    (lang) => {
      onUpdate('themeDirection', lang === 'ar' ? 'rtl' : 'ltr');
    },
    [onUpdate]
  );

  // Reset
  const onReset = useCallback(() => {
    setSettings(defaultSettings);
  }, [defaultSettings, setSettings]);

  // Drawer
  const onToggleDrawer = useCallback(() => {
    setOpenDrawer((prev) => !prev);
  }, []);

  const onCloseDrawer = useCallback(() => {
    setOpenDrawer(false);
  }, []);

  // const canReset = !isEqual(settings, defaultSettings); is not compitable with nextjs need another solution
  // current fix is making is false
  const canReset = settings !== defaultSettings; // !isEqual(settings, defaultSettings);

  const memoizedValue = useMemo(
    () => ({
      ...settings,
      onUpdate,
      // Direction
      onChangeDirectionByLang,
      // Reset
      canReset,
      onReset,
      // Drawer
      open: openDrawer,
      onToggle: onToggleDrawer,
      onClose: onCloseDrawer,
    }),
    [
      onReset,
      onUpdate,
      settings,
      canReset,
      openDrawer,
      onCloseDrawer,
      onToggleDrawer,
      onChangeDirectionByLang,
    ]
  );

  return <SettingsContext.Provider value={memoizedValue}>{children}</SettingsContext.Provider>;
}

SettingsProvider.propTypes = {
  children: PropTypes.node,
  defaultSettings: PropTypes.object,
};
