import React, { useCallback, useContext, useEffect, useState } from 'react';
import { DATA_REFRESH_INTERVAL } from 'config';
import {
  fetchCoinsListData,
  getHistory7dCoinsList,
  getUpdatedCoinsList,
  add7DayHistoryDataToCoinsData,
} from 'helpers/lcwApi';

const LcwCoinsDataContext = React.createContext({});

export const LcwCoinsDataProvider = ({ children }) => {
  const [coinsData, setCoinsData] = useState(null);
  const [pageCoinsList, setPageCoinsList] = useState(null);
  const [history7dCoinsList, setHistory7dCoinsList] = useState(null);
  const [watchlistCoinsList, setWatchlistCoinsList] = useState([]);

  // useEffect(() => {
  //   console.log(coinsData);
  // }, [coinsData, history7dCoinsList]);

  const handleSetPageCoinsList = useCallback(
    ({ currentPage, perPageLimit }) => {
      if (!coinsData) return;

      const pageStartIndex = (currentPage - 1) * perPageLimit;
      const pageEndIndex = currentPage * perPageLimit;

      const pageCoinsList = coinsData.slice(pageStartIndex, pageEndIndex);

      setPageCoinsList(pageCoinsList);
    },
    [coinsData]
  );

  const handleUpdateWatchlist = (coinCode) => {
    setWatchlistCoinsList((prevState) => {
      if (!prevState.includes(coinCode)) {
        const updatedState = [...prevState, coinCode];
        return updatedState;
      }
      const updatedState = prevState.filter((code) => {
        return code !== coinCode;
      });
      return updatedState;
    });
    // setCoinsData((prevState) => {
    //   const updatedState = prevState.map((coin) => {
    //     if (coin.code === coinCode)
    //       return { ...coin, onWatchlist: !coin.onWatchlist };
    //     return coin;
    //   });
    //   return updatedState;
    // });
  };

  useEffect(() => {
    (async () => {
      try {
        const meta = true;
        const data = await fetchCoinsListData(meta);
        setCoinsData(data);
        setInterval(async () => {
          const newData = await fetchCoinsListData();

          setCoinsData((prevState) => {
            const updatedData = getUpdatedCoinsList(prevState, newData);
            return updatedData;
          });
        }, DATA_REFRESH_INTERVAL);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const newHistory7dCoins = await getHistory7dCoinsList(
          pageCoinsList,
          history7dCoinsList
        );

        // Avoid updating state if there's nothing to add, and there won't be nothign to add if the history data for specified coins was already in state
        // Also stops from endless loop due to having history7dCoinsList in dependency list (no guard clause would make history7dCoinsList update every time it's being updated)
        if (newHistory7dCoins?.length === 0) return;

        // Add all history data to the state keeping all data from previous state. That way we have to fetch historical data only once for each coin as getHisotry7dCoinsList fetches only data for coins that are not yet in history7dCoinsList
        setHistory7dCoinsList((prevState) => {
          if (!prevState) return newHistory7dCoins;
          return [...prevState, ...newHistory7dCoins];
        });

        // Add 7d history data to coinsData so all data for rendering views listing coins can bo sourced from one place
        setCoinsData((prevState) => {
          if (!prevState) return;
          const enrichedState = add7DayHistoryDataToCoinsData(
            prevState,
            newHistory7dCoins
          );
          return enrichedState;
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [pageCoinsList, history7dCoinsList]);

  return (
    <LcwCoinsDataContext.Provider
      value={{
        coinsData,
        pageCoinsList,
        history7dCoinsList,
        watchlistCoinsList,
        handleSetPageCoinsList,
        handleUpdateWatchlist,
      }}
    >
      {children}
    </LcwCoinsDataContext.Provider>
  );
};

export const useLcwCoinsData = () => {
  const useLcwCoinsDataContext = useContext(LcwCoinsDataContext);

  if (!useLcwCoinsDataContext)
    throw Error('useLcwApi needs to be used inside useLcwCoinsDataContext');

  return useLcwCoinsDataContext;
};