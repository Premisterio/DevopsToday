# Postman Collection — Travel Planner API

## Importing the collection

1. Open **Postman**
2. Click **Import** (top-left)
3. Drag and drop `Travel_Planner_API.postman_collection.json` or click **Upload Files** and select it
4. The collection **Travel Planner API** appears in your sidebar

## Running the tests

Make sure the backend is running on `http://localhost:8000`.

### Run requests individually

Open any request from the sidebar and click **Send**. Test results appear in the **Tests** tab of the response panel.

### Run the entire collection

1. Right-click the **Travel Planner API** collection → **Run collection**
2. Click **Run Travel Planner API**
3. All requests execute in order with automated test assertions

## Collection variables

| Variable | Default | Description |
|---|---|---|
| `baseUrl` | `http://localhost:8000` | Backend API URL |
| `projectId` | `1` | Auto-set by "Create project" requests |
| `placeId` | `1` | Auto-set by "Add place" request |

These variables update automatically as you run requests, so you can run the collection top-to-bottom as a full integration test.

## What's covered

- **Projects:** Create (with/without places), list, get, update, delete
- **Places:** Add, list, get single, update notes, mark visited
- **Validations:** Empty name (422), invalid artwork ID (422), duplicate place (409)
- **Business rules:** Delete blocked with visited places (400), auto-complete check
- **Health:** Root and `/health` endpoints
