const request = require("supertest");
const app = require("../index");


describe("API Endpoings", () => {
    //testing /register
    test("POST /register - success", async () => {
        const res = await request(app)
            .post("/register")
            .send({
                username: "employee2",
                password: "employee1"
            });

            expect(res.statusCode).toBe(201);
    });

    test("POST /register - duplicate username", async () => {
        const res = await request(app)
            .post("/register")
            .send({
                username: "user1",
                password: "employee1"
            });

            expect(res.statusCode).toBe(400);
    });

    test("POST /register - null username", async () => {
        const res = await request(app)
            .post("/register")
            .send({
                username: "",
                password: "employee1"
            });

            expect(res.statusCode).toBe(400);
    });

    test("POST /register - null password", async () => {
        const res = await request(app)
            .post("/register")
            .send({
                username: "user1",
                password: ""
            });

            expect(res.statusCode).toBe(400);
    });


    // testing login
    test("POST /login - success", async () => {
        const res = await request(app)
            .post("/login")
            .send({
                username: "admin",
                password: "admin"
            });

            expect(res.statusCode).toBe(200);
    });

    test("POST /login - invalid username", async () => {
        const res = await request(app)
            .post("/login")
            .send({
                username: "admin1",
                password: "admin"
            });

            expect(res.statusCode).toBe(400);
    });

    test("POST /login - invalid password", async () => {
        const res = await request(app)
            .post("/login")
            .send({
                username: "admin",
                password: "admin1"
            });

            expect(res.statusCode).toBe(400);
    });

    // testing submit ticket
    let authToken;

    beforeEach(async () => {
        const loginRes = await request(app)
            .post("/login")
            .send({
                username: "admin",
                password: "admin"
            });

        expect(loginRes.statusCode).toBe(200);
        authToken = loginRes.body.token;
    });

    test("POST /tickets - success", async () => {
        const res = await request(app)
            .post("/tickets")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                "description": "gas",
                "type": "travel",
                "amount": 75
            });

            expect(res.statusCode).toBe(201);
    });

    test("POST /tickets - null description", async () => {
        const res = await request(app)
            .post("/tickets")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                "description": "",
                "type": "travel",
                "amount": 75
            });

            expect(res.statusCode).toBe(400);
    });

    test("POST /tickets - null type", async () => {
        const res = await request(app)
            .post("/tickets")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                "description": "gas",
                "type": "",
                "amount": 75
            });

            expect(res.statusCode).toBe(400);
    });

    test("POST /tickets - null amount", async () => {
        const res = await request(app)
            .post("/tickets")
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                "description": "gas",
                "type": "travel",
            });

            expect(res.statusCode).toBe(400);
    });

    afterEach(async () => {
        const res = await request(app)
            .post("/logout")
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.statusCode).toBe(200);
    });

    test("POST /tickets - not logged in", async () => {
        const res = await request(app)
            .post("/tickets")
            .send({
                "description": "gas",
                "type": "travel",
                "amount": 75
            });

            expect(res.statusCode).toBe(403);
    });
    
    // process ticket
    let testTicketId = "3ec0f831-21ed-44ee-a85f-6474268c8dee";
    let testTicketId1 = "1e4a7868-7846-4ec4-a145-f4af8f1e9694";

    let employeeAuthToken;

    beforeEach(async () => {
        await request(app)
            .post("/login")
            .send({
                username: "admin",
                password: "admin"
            });


        await request(app)
            .post("/login")
            .send({
                username: "employee1",
                password: "password123"
            });
    });

    test("PUT /tickets/:id - success", async () => {
        const res = await request(app)
            .put(`/tickets/${testTicketId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                "status": "approved"
            });

            // console.log("Response Status:", res.statusCode); 
            // console.log("Response Body:", res.body); 

            expect(res.statusCode).toBe(200);
    });

    test("PUT /tickets/:id - Changing processed ticket", async () => {
        const res = await request(app)
            .put(`/tickets/${testTicketId1}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                "status": "denied"
            });

            expect(res.statusCode).toBe(401);
    });

    test("PUT /tickets/:id - Ticket does not exist", async () => {
        const res = await request(app)
            .put(`/tickets/${100}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({
                "status": "denied"
            });

            expect(res.statusCode).toBe(401);
    });

    test("PUT /tickets/:id - Forbidden user", async () => {
        const res = await request(app)
            .put(`/tickets/${testTicketId}`)
            .set("Authorization", `Bearer ${employeeAuthToken}`)
            .send({
                "status": "approved"
            });

            expect(res.statusCode).toBe(403);
    });

    test("GET /tickets?status=pending - View pending tickets", async () => {
        const res = await request(app)
            .get("/tickets?status=pending")
            .set("Authorization", `Bearer ${authToken}`);

        console.log("Response Status:", res.statusCode);
        console.log("Response Body:", res.body);

        expect(res.statusCode).toBe(201);
    });

    test("GET /tickets?status=pending - Forbidden view pending tickets", async () => {
        const res = await request(app)
            .get("/tickets?status=pending")
            .set("Authorization", `Bearer ${employeeAuthToken}`);

        console.log("Response Status:", res.statusCode);
        console.log("Response Body:", res.body);

        expect(res.statusCode).toBe(403);
    });

    afterEach(async () => {
        await request(app)
            .post("/logout")
            .set("Authorization", `Bearer ${authToken}`);

        await request(app)
            .post("/logout")
            .set("Authorization", `Bearer ${employeeAuthToken}`);
    });
    
})