
import 'package:flutter/material.dart';
import 'home_screen.dart';
import 'history_screen.dart';
import 'budget_screen.dart';
import 'reports_screen.dart';
import 'settings_screen.dart';
import '../widgets/transaction_form.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const HistoryScreen(),
    const BudgetScreen(),
    const ReportsScreen(),
    const SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddExpense(context),
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add, size: 30, color: Colors.white),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        color: const Color(0xFF101D22).withOpacity(0.95),
        shape: const CircularNotchedRectangle(),
        notchMargin: 8,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(0, Icons.home_outlined, Icons.home, "Home"),
            _buildNavItem(1, Icons.history_outlined, Icons.history, "History"),
            const SizedBox(width: 40),
            _buildNavItem(2, Icons.account_balance_wallet_outlined, Icons.account_balance_wallet, "Budget"),
            _buildNavItem(3, Icons.monitoring, Icons.monitoring, "Reports"),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, IconData activeIcon, String label) {
    bool isActive = _currentIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _currentIndex = index),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(isActive ? activeIcon : icon, 
               color: isActive ? Theme.of(context).primaryColor : Colors.grey),
          Text(label, style: TextStyle(
            fontSize: 10, 
            color: isActive ? Theme.of(context).primaryColor : Colors.grey,
            fontWeight: FontWeight.bold
          )),
        ],
      ),
    );
  }

  void _showAddExpense(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const TransactionForm(),
    );
  }
}
