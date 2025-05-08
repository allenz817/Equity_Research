from setuptools import setup, find_packages

setup(
    name='finance_data_app',
    version='0.1.0',
    author='Your Name',
    author_email='your.email@example.com',
    description='A financial data analysis application using yfinance',
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    install_requires=[
        'yfinance',
        'pandas',
        'numpy',
        'requests'
    ],
    entry_points={
        'console_scripts': [
            'finance-data-app=main:main',
        ],
    },
)