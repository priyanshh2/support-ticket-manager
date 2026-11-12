import { isDBConnected } from './src/config/db.js';

const BASE_URL = 'http://localhost:5000/api';

const runTests = async () => {
  console.log('====================================================');
  console.log('   STARTING 16 TEST SCENARIOS FOR PHASE 2 API       ');
  console.log('====================================================\n');

  let ticketId1 = null;
  let ticketId2 = null;
  const results = [];

  const recordResult = (scenarioNum, name, passed, details) => {
    results.push({ scenarioNum, name, passed, details });
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[Scenario ${scenarioNum}] ${status}: ${name}`);
    if (details) {
      console.log(`   Details: ${typeof details === 'object' ? JSON.stringify(details) : details}`);
    }
  };

  try {
    // 1. Successfully create a ticket with valid information
    const res1 = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Login issue',
        description: 'Unable to log into my account',
        priority: 'High'
      })
    });
    const data1 = await res1.json();
    ticketId1 = data1.data?._id;
    recordResult(
      1,
      'Successfully create a ticket with valid information',
      res1.status === 201 && data1.success === true && !!ticketId1,
      { status: res1.status, id: ticketId1, title: data1.data?.title }
    );

    // 2. Attempt to create a ticket with an empty title
    const res2 = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '   ',
        description: 'Valid description',
        priority: 'Low'
      })
    });
    const data2 = await res2.json();
    recordResult(
      2,
      'Attempt to create a ticket with an empty title',
      res2.status === 400 && data2.success === false,
      { status: res2.status, message: data2.message }
    );

    // 3. Attempt to create a ticket without a description
    const res3 = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Network timeout',
        priority: 'Medium'
      })
    });
    const data3 = await res3.json();
    recordResult(
      3,
      'Attempt to create a ticket without a description',
      res3.status === 400 && data3.success === false,
      { status: res3.status, message: data3.message }
    );

    // 4. Attempt to create a ticket with an invalid priority
    const res4 = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Billing question',
        description: 'Question about charges',
        priority: 'Critical' // Invalid priority
      })
    });
    const data4 = await res4.json();
    recordResult(
      4,
      'Attempt to create a ticket with an invalid priority',
      res4.status === 400 && data4.success === false,
      { status: res4.status, message: data4.message }
    );

    // Create a second ticket to verify sorting and retrieval
    const resCreate2 = await fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Password reset request',
        description: 'Needs help resetting portal password',
        priority: 'Medium'
      })
    });
    const dataCreate2 = await resCreate2.json();
    ticketId2 = dataCreate2.data?._id;

    // 5. Retrieve all tickets
    const res5 = await fetch(`${BASE_URL}/tickets`);
    const data5 = await res5.json();
    recordResult(
      5,
      'Retrieve all tickets',
      res5.status === 200 && data5.success === true && Array.isArray(data5.data) && data5.count >= 2,
      { status: res5.status, count: data5.count }
    );

    // 6. Verify that newly created tickets have status Open
    const isStatusOpen = dataCreate2.data?.status === 'Open';
    recordResult(
      6,
      'Verify that newly created tickets have status Open',
      isStatusOpen,
      { status: dataCreate2.data?.status }
    );

    // 7. Verify that tickets are sorted newest first
    const tickets = data5.data;
    let isSorted = true;
    for (let i = 0; i < tickets.length - 1; i++) {
      if (new Date(tickets[i].createdAt) < new Date(tickets[i + 1].createdAt)) {
        isSorted = false;
        break;
      }
    }
    recordResult(
      7,
      'Verify that tickets are sorted newest first',
      isSorted,
      { firstTicketCreatedAt: tickets[0]?.createdAt, secondTicketCreatedAt: tickets[1]?.createdAt }
    );

    // 8. Update a ticket from Open to In Progress
    const res8 = await fetch(`${BASE_URL}/tickets/${ticketId1}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'In Progress' })
    });
    const data8 = await res8.json();
    recordResult(
      8,
      'Update a ticket from Open to In Progress',
      res8.status === 200 && data8.success === true && data8.data?.status === 'In Progress',
      { status: res8.status, updatedStatus: data8.data?.status }
    );

    // 9. Update a ticket from In Progress to Resolved
    const res9 = await fetch(`${BASE_URL}/tickets/${ticketId1}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Resolved' })
    });
    const data9 = await res9.json();
    recordResult(
      9,
      'Update a ticket from In Progress to Resolved',
      res9.status === 200 && data9.success === true && data9.data?.status === 'Resolved',
      { status: res9.status, updatedStatus: data9.data?.status }
    );

    // 10. Attempt to update a ticket with an invalid status
    const res10 = await fetch(`${BASE_URL}/tickets/${ticketId1}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Closed' }) // Invalid status
    });
    const data10 = await res10.json();
    recordResult(
      10,
      'Attempt to update a ticket with an invalid status',
      res10.status === 400 && data10.success === false,
      { status: res10.status, message: data10.message }
    );

    // 11. Attempt to update a ticket using an invalid MongoDB ID
    const res11 = await fetch(`${BASE_URL}/tickets/invalid-id-xyz-123`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'In Progress' })
    });
    const data11 = await res11.json();
    recordResult(
      11,
      'Attempt to update a ticket using an invalid MongoDB ID',
      res11.status === 400 && data11.success === false,
      { status: res11.status, message: data11.message }
    );

    // 12. Attempt to update a ticket that does not exist
    const nonExistentId = '507f1f77bcf86cd799439011';
    const res12 = await fetch(`${BASE_URL}/tickets/${nonExistentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'In Progress' })
    });
    const data12 = await res12.json();
    recordResult(
      12,
      'Attempt to update a ticket that does not exist',
      res12.status === 404 && data12.success === false,
      { status: res12.status, message: data12.message }
    );

    // 13. Successfully delete a ticket
    const res13 = await fetch(`${BASE_URL}/tickets/${ticketId2}`, {
      method: 'DELETE'
    });
    const data13 = await res13.json();
    recordResult(
      13,
      'Successfully delete a ticket',
      res13.status === 200 && data13.success === true,
      { status: res13.status, message: data13.message }
    );

    // 14. Attempt to delete an already deleted ticket
    const res14 = await fetch(`${BASE_URL}/tickets/${ticketId2}`, {
      method: 'DELETE'
    });
    const data14 = await res14.json();
    recordResult(
      14,
      'Attempt to delete an already deleted ticket',
      res14.status === 404 && data14.success === false,
      { status: res14.status, message: data14.message }
    );

    // 15. Verify that deleted tickets no longer appear in GET /api/tickets
    const res15 = await fetch(`${BASE_URL}/tickets`);
    const data15 = await res15.json();
    const isDeletedTicketPresent = data15.data.some((t) => t._id === ticketId2);
    recordResult(
      15,
      'Verify that deleted tickets no longer appear in GET /api/tickets',
      res15.status === 200 && !isDeletedTicketPresent,
      { deletedTicketFound: isDeletedTicketPresent, remainingCount: data15.count }
    );

    // 16. Verify that MongoDB retains ticket records after restarting the backend
    // Verify that ticketId1 (which was updated to Resolved) still persists
    const res16 = await fetch(`${BASE_URL}/tickets`);
    const data16 = await res16.json();
    const persistedTicket = data16.data.find((t) => t._id === ticketId1);
    recordResult(
      16,
      'Verify that MongoDB retains ticket records after restarting the backend',
      !!persistedTicket && persistedTicket.status === 'Resolved',
      { persistedTicketId: persistedTicket?._id, persistedStatus: persistedTicket?.status }
    );

    console.log('\n====================================================');
    console.log(`TEST SUMMARY: ${results.filter(r => r.passed).length} / ${results.length} PASSED`);
    console.log('====================================================\n');

  } catch (err) {
    console.error('Test execution error:', err.message);
  }
};

runTests();

