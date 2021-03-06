import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import {
  EXPENSE_UPDATE,
  EXPENSE_CREATE,
  EXPENSES_FETCH_SUCCESS,
  EXPENSE_SAVE_SUCCESS
} from './types';

export const expenseUpdate = ({ prop, value }) => {
  return (dispatch) => {
    dispatch({type: EXPENSE_UPDATE,
      payload: { prop, value }
    });
  };
}

export const expenseCreate = ({ name, amount, deadline }) => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/expenses`)
      .push({ name, amount, deadline })
      .then(() => {
        dispatch({ type: EXPENSE_CREATE });
        Actions.expenseList({ type: 'reset'});
      });
  };
};

export const expensesFetch = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/expenses`)
      .on('value', snapshot => {
        dispatch({
          type: EXPENSES_FETCH_SUCCESS,
          payload: snapshot.val()
        });
      });
  };
};

export const expenseSave = ({ name, amount, deadline , uid }) => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/expenses/${uid}`)
      .set({ name, amount, deadline })
      .then(() => {
        dispatch({ type: EXPENSE_SAVE_SUCCESS });
        Actions.pop();
      });
  };
};

export const expenseDelete = ({ uid }) => {
  const { currentUser }  = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/expenses/${uid}`)
      .remove()
      .then(() => {
        Actions.expenseList({ type: 'reset' });
      });
  };
};