import { host } from './urls';

export const fetchMasteryUpdate = async (pk, mastery_level) => {
  const token = localStorage.getItem('authToken');
  const url = `${host}/api/user-piece/${pk}/`;
  const data = {
    mastery_level: parseInt(mastery_level),
  };
  console.log(`token is ${token}`);
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return response.status;
  }

  return response.data;
};

export const fetchRemovePiece = async (pieceID) => {
  const token = localStorage.getItem('authToken');

  const url = `${host}/api/user-piece/`;
  const data = {
    // userID, pieceID, masteryLevel
    piece: pieceID,
  };
  console.log('removing from database');

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.log(`Error deleting piece. ${response.status}`);
  }

  console.log(response.status);
};

export const fetchAddPiece = async (pieceID, mastery_level) => {
  const token = localStorage.getItem('authToken');

  console.log('fetchAddPiece called');
  const url = `${host}/api/user-piece/`;
  const data = {
    // userID, pieceID, masteryLevel
    user: localStorage.getItem('userID'),
    piece: pieceID,
    mastery_level: mastery_level,
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const jsonString = await response.json();
  const jsonData = JSON.parse(jsonString);

  if (!response.ok) {
    console.log(`Error saving piece. ${response.status}`);
  }

  return jsonData;
};

//http://localhost:8000/api/techniques/
