import pytest
import httpx
import asyncio

BASE_URL = "http://localhost:8000"

@pytest.mark.asyncio
async def test_end_to_end():
    async with httpx.AsyncClient(base_url=BASE_URL) as client:
        email = "testuser@example.com"
        password = "testpassword123"

        res = await client.post("/auth/register", json={"email": email, "password": password})
        assert res.status_code in [200, 400], "Register should succeed or return 400 if already registered"

        res = await client.post("/auth/login", data={"username": email, "password": password})
        assert res.status_code == 200, "Login must succeed"
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        tx_data = {
            "type": "expense",
            "amount": 100.5,
            "category": "Food",
            "description": "Lunch"
        }
        res = await client.post("/transactions", json=tx_data, headers=headers)
        assert res.status_code == 200, "Should create transaction"
        tx_id = res.json()["id"]

        res = await client.get("/transactions", headers=headers)
        assert res.status_code == 200, "Should list transactions"
        txs = res.json()
        assert len(txs) > 0, "Should have at least one transaction"

        res = await client.get(f"/transactions/{tx_id}", headers=headers)
        assert res.status_code == 200, "Should get specific transaction"

        res = await client.put(f"/transactions/{tx_id}", json={"amount": 150.0}, headers=headers)
        assert res.status_code == 200, "Should update transaction"
        assert res.json()["amount"] == 150.0, "Amount should be updated"

        res = await client.get("/summary", headers=headers)
        assert res.status_code == 200, "Should get summary"
        summary = res.json()
        assert "total_expense" in summary, "Summary must have total_expense"

        res = await client.delete(f"/transactions/{tx_id}", headers=headers)
        assert res.status_code == 200, "Should delete transaction"

        res = await client.get(f"/transactions/{tx_id}", headers=headers)
        assert res.status_code == 404, "Transaction should be not found"

        print("All API endpoints tested successfully!")

if __name__ == "__main__":
    asyncio.run(test_end_to_end())
