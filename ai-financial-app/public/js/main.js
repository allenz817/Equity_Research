class FinancialExtractor {
    constructor() {
        this.selectedFile = null;
        this.excelFileName = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const extractBtn = document.getElementById('extractBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const resetBtn = document.getElementById('resetBtn');

        // Upload area click
        uploadArea.addEventListener('click', () => fileInput.click());

        // File selection
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop events
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            this.handleFileSelect({ target: { files: e.dataTransfer.files } });
        });

        // Button events
        extractBtn.addEventListener('click', () => this.extractData());
        downloadBtn.addEventListener('click', () => this.downloadExcel());
        resetBtn.addEventListener('click', () => this.resetApp());
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            this.showError('Please select a valid file type (PDF, PNG, JPG, JPEG)');
            return;
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            this.showError('File size must be less than 10MB');
            return;
        }

        this.selectedFile = file;
        this.updateUploadArea(file);
        document.getElementById('extractBtn').disabled = false;
    }

    updateUploadArea(file) {
        const uploadArea = document.getElementById('uploadArea');
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        const fileIcon = this.getFileIcon(file.type);
        
        uploadArea.innerHTML = `
            <div class="file-selected">
                <div style="font-size: 3rem; margin-bottom: 10px;">${fileIcon}</div>
                <p><strong>${file.name}</strong></p>
                <p class="file-size">${fileSize} MB • ${file.type.split('/')[1].toUpperCase()}</p>
                <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                    Click to select a different file
                </p>
            </div>
        `;
    }

    getFileIcon(fileType) {
        if (fileType === 'application/pdf') return '📄';
        if (fileType.startsWith('image/')) return '🖼️';
        return '📎';
    }

    async extractData() {
        if (!this.selectedFile) {
            this.showError('Please select a file first');
            return;
        }

        this.showLoading();

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        try {
            const response = await fetch('/api/extract/financial-data', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Extraction failed');
            }

            if (data.success) {
                this.displayResults(data.data);
                this.excelFileName = data.excelFile;
                this.showSuccess('Financial data extracted successfully!');
            } else {
                throw new Error(data.error || 'Unknown error occurred');
            }
        } catch (error) {
            console.error('Extraction error:', error);
            this.showError(`Error extracting data: ${error.message}`);
            this.hideLoading();
        }
    }

    showLoading() {
        const resultsSection = document.getElementById('resultsSection');
        const loading = document.getElementById('loading');
        const results = document.getElementById('results');

        resultsSection.style.display = 'block';
        loading.style.display = 'block';
        results.style.display = 'none';

        // Scroll to results section
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        const results = document.getElementById('results');
        
        loading.style.display = 'none';
        results.style.display = 'block';
    }

    displayResults(data) {
        this.hideLoading();
        
        // Update period information
        const periodInfo = document.getElementById('periodInfo');
        periodInfo.textContent = `Financial Data - ${data.period || 'Period Not Specified'}`;

        // Populate tables
        this.populateTable('incomeTable', data.incomeStatement, 'Income Statement');
        this.populateTable('balanceTable', data.balanceSheet, 'Balance Sheet');
        this.populateTable('cashFlowTable', data.cashFlow, 'Cash Flow');
    }

    populateTable(tableId, data, tableName) {
        const table = document.getElementById(tableId);
        
        if (!data || Object.keys(data).length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="2" style="text-align: center; color: #999; font-style: italic;">
                        No ${tableName.toLowerCase()} data extracted
                    </td>
                </tr>
            `;
            return;
        }

        const rows = Object.entries(data).map(([key, value]) => {
            const formattedValue = this.formatCurrency(value);
            const rowClass = value < 0 ? 'style="color: #dc3545;"' : '';
            return `
                <tr>
                    <td>${key}</td>
                    <td class="currency" ${rowClass}>${formattedValue}</td>
                </tr>
            `;
        }).join('');

        table.innerHTML = `
            <thead>
                <tr>
                    <th>Item</th>
                    <th style="text-align: right;">Amount (Millions)</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        `;
    }

    formatCurrency(value) {
        if (value === 0 || value === null || value === undefined) {
            return '$0.00';
        }
        
        const absValue = Math.abs(value);
        const sign = value < 0 ? '-' : '';
        
        return `${sign}$${absValue.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    async downloadExcel() {
        if (!this.excelFileName) {
            this.showError('No Excel file available for download');
            return;
        }

        try {
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = `/api/extract/download/${this.excelFileName}`;
            link.download = this.excelFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showSuccess('Excel file downloaded successfully!');
        } catch (error) {
            console.error('Download error:', error);
            this.showError('Failed to download Excel file');
        }
    }

    resetApp() {
        // Reset file selection
        this.selectedFile = null;
        this.excelFileName = null;
        
        // Reset upload area
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.innerHTML = `
            <div class="upload-icon">📄</div>
            <h3>Drop your files here</h3>
            <p>or click to browse</p>
            <p class="file-types">Supports: PDF, PNG, JPG, JPEG (Max 10MB)</p>
        `;
        
        // Reset file input
        document.getElementById('fileInput').value = '';
        
        // Disable extract button
        document.getElementById('extractBtn').disabled = true;
        
        // Hide results section
        document.getElementById('resultsSection').style.display = 'none';
        
        // Clear any messages
        this.clearMessages();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showError(message) {
        this.clearMessages();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(errorDiv, container.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    showSuccess(message) {
        this.clearMessages();
        const successDiv = document.createElement('div');
        successDiv.className = 'success';
        successDiv.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(successDiv, container.firstChild);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }

    clearMessages() {
        const messages = document.querySelectorAll('.error, .success');
        messages.forEach(msg => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FinancialExtractor();
});
