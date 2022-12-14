import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DATA_REFRESH_INTERVAL } from 'config';
import { fetchCoinsData } from 'helpers/lcwApi';
import { useHistory7d } from './useHistory7d';
import { useWatchlist } from './useWatchlist';
import { useOnPageErrors } from './useOnPageError';
import { useDispatch } from 'react-redux';
import {
  setCoinsData,
  updateCoinsData,
  addHistory7dData,
  addWatchlistData,
} from 'store/coinsDataSlice';

const LcwCoinsDataContext = React.createContext({});

export const LcwCoinsDataProvider = ({ children }) => {
  const dispatch = useDispatch();
  // const [coinsData, setCoinsData] = useState(null);
  const [coinsCurPageCoinsList, setCoinsCurPageCoinsList] = useState(null);
  const [currentCoinData, setCurrentCoinData] = useState(null);
  // To avoid repeatedly fetching 7d history data for same coin
  const { history7dCoinsList } = useHistory7d(
    coinsCurPageCoinsList,
    currentCoinData
  );
  const { usersWatchlist, watchlistCoinCodes, handleUpdateWatchlist } =
    useWatchlist();
  const { dispatchOnPageError } = useOnPageErrors();

  const handleSetCoinsCurPageCoinsList = useCallback((data) => {
    setCoinsCurPageCoinsList(data);
  }, []);

  const handleSetCurrentCoinData = useCallback((coin) => {
    setCurrentCoinData(coin);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Fetch and set coinsData
        const meta = true;
        const data = await fetchCoinsData(meta);
        dispatch(setCoinsData({ data }));
        // Update coinsData onWatchlist property based on localStorage (usersWatchlist)
        if (usersWatchlist)
          dispatch(addWatchlistData({ watchlistData: usersWatchlist }));
        // Fetch new coins data without metadata to keep it up to date
        setInterval(async () => {
          const newData = await fetchCoinsData();
          dispatch(updateCoinsData({ newData }));
        }, DATA_REFRESH_INTERVAL);
      } catch (err) {
        dispatchOnPageError('coinsData', err.response.status);
      }
    })();
    // Won't cause rerenders as usersWatchlist gets created at app start and doesn't get updated
  }, [usersWatchlist, dispatchOnPageError, dispatch]);

  useEffect(() => {
    // Add 7d history data to coinsData so all data for rendering views with coins table can bo sourced from one place
    dispatch(addHistory7dData({ history7dCoinsList }));
  }, [history7dCoinsList, dispatch]);

  useEffect(() => {
    dispatch(addWatchlistData({ watchlistData: watchlistCoinCodes }));
  }, [watchlistCoinCodes, dispatch]);

  return (
    <LcwCoinsDataContext.Provider
      value={{
        currentCoinData,
        coinsCurPageCoinsList,
        history7dCoinsList,
        handleSetCurrentCoinData,
        handleSetCoinsCurPageCoinsList,
        handleUpdateWatchlist,
        watchlistCoinCodes,
      }}
    >
      {children}
    </LcwCoinsDataContext.Provider>
  );
};

export const useLcwCoinsData = () => {
  const useLcwCoinsDataContext = useContext(LcwCoinsDataContext);

  if (!useLcwCoinsDataContext)
    throw new Error(
      'useLcwCoinsData needs to be used inside useLcwCoinsDataContext'
    );

  return useLcwCoinsDataContext;
};
