import tkinter as tk
from tkinter import filedialog, ttk, messagebox
import pandas as pd
from data_processing.excel_reader import read_excel
from models.valuation import ValuationModel

class App:
    """Simple UI for the valuation model application"""
    
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Company Valuation Model")
        self.root.geometry("800x600")
        self.financial_data = None
        self.valuation_result = None
        
        self.setup_ui()
    
    def setup_ui(self):
        """Set up the UI components"""
        # Create main frame
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # File selection section
        file_frame = ttk.LabelFrame(main_frame, text="Select Financial Statements", padding="10")
        file_frame.pack(fill=tk.X, pady=10)
        
        self.file_path_var = tk.StringVar()
        file_entry = ttk.Entry(file_frame, textvariable=self.file_path_var, width=60)
        file_entry.pack(side=tk.LEFT, padx=5, expand=True, fill=tk.X)
        
        browse_btn = ttk.Button(file_frame, text="Browse", command=self.browse_file)
        browse_btn.pack(side=tk.RIGHT, padx=5)
        
        # Valuation parameters section
        params_frame = ttk.LabelFrame(main_frame, text="Valuation Parameters", padding="10")
        params_frame.pack(fill=tk.X, pady=10)
        
        # Discount rate
        ttk.Label(params_frame, text="Discount Rate:").grid(row=0, column=0, sticky=tk.W, padx=5, pady=5)
        self.discount_rate_var = tk.DoubleVar(value=0.10)
        discount_entry = ttk.Entry(params_frame, textvariable=self.discount_rate_var, width=10)
        discount_entry.grid(row=0, column=1, sticky=tk.W, padx=5, pady=5)
        
        # Growth rate
        ttk.Label(params_frame, text="Growth Rate:").grid(row=1, column=0, sticky=tk.W, padx=5, pady=5)
        self.growth_rate_var = tk.DoubleVar(value=0.03)
        growth_entry = ttk.Entry(params_frame, textvariable=self.growth_rate_var, width=10)
        growth_entry.grid(row=1, column=1, sticky=tk.W, padx=5, pady=5)
        
        # PE Multiple
        ttk.Label(params_frame, text="P/E Multiple:").grid(row=0, column=2, sticky=tk.W, padx=5, pady=5)
        self.pe_multiple_var = tk.DoubleVar(value=15.0)
        pe_entry = ttk.Entry(params_frame, textvariable=self.pe_multiple_var, width=10)
        pe_entry.grid(row=0, column=3, sticky=tk.W, padx=5, pady=5)
        
        # Asset discount
        ttk.Label(params_frame, text="Asset Discount:").grid(row=1, column=2, sticky=tk.W, padx=5, pady=5)
        self.asset_discount_var = tk.DoubleVar(value=0.1)
        asset_entry = ttk.Entry(params_frame, textvariable=self.asset_discount_var, width=10)
        asset_entry.grid(row=1, column=3, sticky=tk.W, padx=5, pady=5)
        
        # Action buttons
        btn_frame = ttk.Frame(main_frame)
        btn_frame.pack(fill=tk.X, pady=10)
        
        calculate_btn = ttk.Button(btn_frame, text="Calculate Valuation", command=self.calculate_valuation)
        calculate_btn.pack(side=tk.RIGHT, padx=5)
        
        # Results section
        results_frame = ttk.LabelFrame(main_frame, text="Valuation Results", padding="10")
        results_frame.pack(fill=tk.BOTH, expand=True, pady=10)
        
        self.results_text = tk.Text(results_frame, wrap=tk.WORD, height=20)
        self.results_text.pack(fill=tk.BOTH, expand=True)
        
    def browse_file(self):
        """Open file dialog to select Excel file"""
        file_path = filedialog.askopenfilename(
            title="Select Financial Statements Excel File",
            filetypes=[("Excel files", "*.xlsx *.xls")]
        )
        
        if file_path:
            self.file_path_var.set(file_path)
    
    def calculate_valuation(self):
        """Calculate valuation based on the selected file and parameters"""
        try:
            file_path = self.file_path_var.get()
            
            if not file_path:
                messagebox.showerror("Error", "Please select an Excel file")
                return
                
            # Read the financial statements
            self.financial_data = read_excel(file_path)
            
            # Create valuation model
            valuation_model = ValuationModel(self.financial_data)
            
            # Get parameters
            discount_rate = self.discount_rate_var.get()
            growth_rate = self.growth_rate_var.get()
            pe_multiple = self.pe_multiple_var.get()
            asset_discount = self.asset_discount_var.get()
            
            # Calculate DCF with custom parameters
            dcf_val = valuation_model.calculate_dcf_valuation(
                discount_rate=discount_rate,
                growth_rate=growth_rate
            )
            
            # Calculate multiple valuation with custom PE
            multiple_val = valuation_model.calculate_multiple_valuation(
                pe_multiple=pe_multiple
            )
            
            # Calculate asset valuation with custom discount
            asset_val = valuation_model.calculate_asset_based_valuation(
                discount=asset_discount
            )
            
            # Weighted average
            weighted_valuation = (dcf_val * 0.5) + (multiple_val * 0.3) + (asset_val * 0.2)
            
            # Display results
            self.results_text.delete(1.0, tk.END)
            
            results_str = f"""
VALUATION RESULTS

DCF Valuation: ${dcf_val:,.2f}
Earnings Multiple Valuation: ${multiple_val:,.2f}
Asset-Based Valuation: ${asset_val:,.2f}

WEIGHTED VALUATION: ${weighted_valuation:,.2f}

FINANCIAL RATIOS
"""
            # Add ratios
            for name, value in valuation_model.ratios.items():
                results_str += f"{name.replace('_', ' ').title()}: {value:.4f}\n"
                
            self.results_text.insert(tk.END, results_str)
            
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {str(e)}")
    
    def run(self):
        """Start the UI application"""
        self.root.mainloop()