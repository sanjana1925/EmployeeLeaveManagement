// Additional JavaScript for new features

// Leave Application Form Handler
const leaveForm = document.getElementById('leaveApplicationForm');
if (leaveForm) {
    leaveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(leaveForm);
        const leaveRequest = {
            id: Date.now(),
            type: formData.get('leaveType'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            reason: formData.get('reason'),
            status: 'Pending',
            employeeName: currentUser?.name || 'John Doe'
        };
        
        // Store leave request
        const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
        leaves.push(leaveRequest);
        localStorage.setItem('leaves', JSON.stringify(leaves));
        
        alert('Leave request submitted successfully!');
        window.location.href = 'leave-history.html';
    });
}

// Leave History Table
function updateLeaveHistory() {
    const leaveHistoryTable = document.getElementById('leaveHistoryTable');
    if (leaveHistoryTable) {
        const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
        leaveHistoryTable.innerHTML = leaves.map(leave => `
            <tr>
                <td>${leave.type}</td>
                <td>${leave.startDate}</td>
                <td>${leave.endDate}</td>
                <td>${calculateDays(leave.startDate, leave.endDate)}</td>
                <td>
                    <span class="status-badge status-${leave.status.toLowerCase()}">
                        ${leave.status}
                    </span>
                </td>
                <td>
                    ${leave.status === 'Pending' ? 
                        `<button onclick="cancelLeave(${leave.id})" class="btn btn-danger btn-sm">Cancel</button>` : 
                        '-'}
                </td>
            </tr>
        `).join('');
    }
}

// Approval Table
function updateApprovalTable() {
    const approvalTable = document.getElementById('approvalTable');
    if (approvalTable) {
        const leaves = JSON.parse(localStorage.getItem('leaves') || '[]')
            .filter(leave => leave.status === 'Pending');
        
        approvalTable.innerHTML = leaves.map(leave => `
            <tr>
                <td>${leave.employeeName}</td>
                <td>${leave.type}</td>
                <td>${leave.startDate} to ${leave.endDate}</td>
                <td>${leave.reason}</td>
                <td>
                    <span class="status-badge status-pending">Pending</span>
                </td>
                <td>
                    <button onclick="approveLeave(${leave.id})" class="btn btn-success btn-sm">Approve</button>
                    <button onclick="rejectLeave(${leave.id})" class="btn btn-danger btn-sm">Reject</button>
                </td>
            </tr>
        `).join('');
    }
}

// Helper Functions
function calculateDays(start, end) {
    const date1 = new Date(start);
    const date2 = new Date(end);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
}

function approveLeave(id) {
    updateLeaveStatus(id, 'Approved');
}

function rejectLeave(id) {
    updateLeaveStatus(id, 'Rejected');
}

function cancelLeave(id) {
    if (confirm('Are you sure you want to cancel this leave request?')) {
        updateLeaveStatus(id, 'Cancelled');
    }
}

function updateLeaveStatus(id, status) {
    const leaves = JSON.parse(localStorage.getItem('leaves') || '[]');
    const updatedLeaves = leaves.map(leave => 
        leave.id === id ? { ...leave, status } : leave
    );
    localStorage.setItem('leaves', JSON.stringify(updatedLeaves));
    
    // Refresh tables
    updateLeaveHistory();
    updateApprovalTable();
}

// Initialize tables when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateLeaveHistory();
    updateApprovalTable();
});