// Google API Types
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: {
          apiKey: string;
          clientId: string;
          discoveryDocs: string[];
          scope: string;
        }) => Promise<any>;
        calendar: {
          events: {
            list: (params: any) => Promise<any>;
          };
        };
      };
      auth2: {
        init: (config: { client_id: string }) => Promise<any>;
        getAuthInstance: () => {
          isSignedIn: {
            get: () => boolean;
          };
          currentUser: {
            get: () => {
              getBasicProfile: () => {
                getId: () => string;
                getName: () => string;
                getEmail: () => string;
                getImageUrl: () => string;
                getGivenName: () => string;
                getFamilyName: () => string;
              };
            };
          };
          signIn: (options?: { scope: string }) => Promise<any>;
          signOut: () => Promise<void>;
        };
      };
    };
  }
}

export {};