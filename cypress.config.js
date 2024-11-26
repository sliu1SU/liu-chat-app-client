import { defineConfig } from "cypress";
import admin from './FirebaseAdminSdk.js'; // Use `import` instead of `require`

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        deleteFirebaseUser(uid) {
          return admin.auth().deleteUser(uid).then(() => {
                console.log(`Successfully deleted user with UID: ${uid}`);
                return null;
              }).catch((error) => {
                console.error('Error deleting user:', error);
                throw error;
              });
        },

        getUid(email) {
          return admin.auth().getUserByEmail(email).then((userRecord) => {
            console.log(`Successfully get user object with email: ${email}`);
            return userRecord.uid;
          }).catch((error) => {
            console.error('Error deleting user:', error);
            throw error;
          });
        },

        createTestUser({email, password}) {
          console.log('email:', email, 'pass:',password)
          return admin.auth().createUser({
            email: email,
            password: password,
          }).then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log('Successfully created new user:', userRecord.uid);
            return userRecord.uid;
          }).catch((error) => {
            console.log('Error creating new user:', error);
            throw error;
          });
        },

      });
    },
  },
});
