export const mockResponse = { status: 200 };
export const mockParams = {
  q: 'test',
  type: 'artist,track,album',
};

export const mockAlbumByArtists = {
    items: [{
        name: 'name',
        images: [{ url: 'dummy'}],
        release_date: '2021-01-21',
        id: '123',
    }]
};

export const mockTracks = {
    items: [{
        name: 'In Th end',
        artists: [{ name: 'Linkin Park', id: '123'}]
    }]
};

export const mockArtistInfo = {
    followers: { total: 213213213 },
    name: 'Linkin Park',
    images: [{ url: 'dummy'}],
    id: '123',
};

export const mockToken = {
    access_token: 'BQCuqVNdutmQHJsyqm9D5HMnALMy8T51VwmIS-jrsfFypbVUqvFWT0TA1UtPFxtCOVLA16T8BshAJSYmG3A_PCt9SQE_LU1MV2vRI2f4Jo66ifDGm6H_vsjvfsStVyB1feQO_FwvuK_9P56Zf9b_Prahk9MoqZ94DXMLiyOef86ZR9a5mQ',
    token_type: 'Bearer',
    expires_in: 121,
    refresh_token: 'AQCiAHGO3p0TJ7tOh6q3J7jZ_RlXryHAUu6wpTemlriFXRS8gDqzcUwFlL_JYemQiPVwDx2U99aDEndB1vmW8ddE0tgAzm4g4drfdCvQtVWlsn01PLCydvlNq8LrzDGTmiY',
    scope: 'user-read-email user-read-private',
};
