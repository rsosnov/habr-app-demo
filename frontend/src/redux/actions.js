import {isServerSide} from "../utility";
import fetch from "cross-fetch";

export const START_FETCHING_CARD = "START_FETCHING_CARD";
export const FINISH_FETCHING_CARD = "FINISH_FETCHING_CARD";
export const NAVIGATE = "NAVIGATE";

export function fetchCardIfNeeded() {
  return (dispatch, getState) => {
    let state = getState().page;
    if (state.cardData === undefined || state.cardData.slug !== state.cardSlug) {
      return dispatch(fetchCard());
    }
  };
}

function fetchCard() {
  return (dispatch, getState) => {
    dispatch(startFetchingCard());
    let url = apiPath() + "/card/" + getState().page.cardSlug;
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(finishFetchingCard(json)));
  };
}

function startFetchingCard() {
  return {
    type: START_FETCHING_CARD
  };
}

function finishFetchingCard(json) {
  return {
    type: FINISH_FETCHING_CARD,
    cardData: json
  };
}

function apiPath() {
  if (isServerSide()) {
    return "http://backend:40001/api/v1";
  }
  return "http://localhost:40001/api/v1";
}

export function navigate(link, dontPushState) {
  if (!isServerSide() && !dontPushState) {
    history.pushState({
      pathname: link.pathname,
      href: link.href
    }, "", link.href);
  }
  return {
    type: NAVIGATE,
    path: link.pathname
  }
}