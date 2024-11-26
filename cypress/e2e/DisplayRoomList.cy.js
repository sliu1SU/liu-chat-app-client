describe('Test DisplayRoomList.jsx', () => {
    it('should add one room, show a list of room, and enter a chat room', () => {
        cy.visit('http://localhost:5173/');
        cy.get('#email-input').type('test1@gmail.com');
        cy.get('#password-input').type('12345678');
        cy.get('#submit-login-bt').click();

        // now we will be at the room list page
        cy.get('ul li')
            .its('length')
            .then((initLen) => {
                // Use initLen within this function
                cy.log(`Initial length: ${initLen}`);
                // try to add a new room
                cy.get('#room-name-input').type('cypress-name');
                cy.get('#room-decription-input').type('cypress-desc');
                cy.get('#submit-create-room-bt').click();

                // Assert the new length
                cy.get('ul li')
                    .its('length')
                    .should('eq', initLen + 1);
            });

        // grab the first chat room on the list, click it, you should enter a specific chat room
        // Get the text content of the first <li> element to extract room.id
        cy.get('ul li').first().invoke('text').then((text) => {
            // Extract room.id from the text (assumes the format "{room.id} - {room.name} - {room.description}")
            const roomId = text.split(' - ')[0].trim();

            // Click the first link in the <li> element
            cy.get('ul li').first().find('a').click();

            // Verify the URL contains the room id
            cy.url().should('include', `/${roomId}`);
        });

    });
})