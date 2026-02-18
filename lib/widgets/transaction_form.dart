
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class TransactionForm extends StatefulWidget {
  const TransactionForm({super.key});

  @override
  State<TransactionForm> createState() => _TransactionFormState();
}

class _TransactionFormState extends State<TransactionForm> {
  final TextEditingController _amountController = TextEditingController(text: "0.00");
  final TextEditingController _noteController = TextEditingController();
  String _selectedMethod = "Cash";
  DateTime _selectedDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.9,
      decoration: const BoxDecoration(
        color: Color(0xFF101D22),
        borderRadius: BorderRadius.vertical(top: Radius.circular(30)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  const SizedBox(height: 40),
                  _buildAmountInput(),
                  const SizedBox(height: 40),
                  _buildSectionLabel("PAYMENT METHOD"),
                  _buildMethodChips(),
                  const SizedBox(height: 30),
                  _buildSectionLabel("NOTES"),
                  _buildNotesInput(),
                  const SizedBox(height: 30),
                  _buildDatePicker(),
                ],
              ),
            ),
          ),
          _buildSaveButton(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
        const Text("Add Expense", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
        TextButton(onPressed: () {}, child: const Text("Reset")),
      ],
    );
  }

  Widget _buildAmountInput() {
    return TextField(
      controller: _amountController,
      textAlign: TextAlign.center,
      keyboardType: TextInputType.number,
      style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold),
      decoration: const InputDecoration(
        prefixText: "\$ ",
        border: InputBorder.none,
      ),
    );
  }

  Widget _buildSectionLabel(String text) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Text(text, style: const TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildMethodChips() {
    final methods = ["Cash", "Debit Card", "Credit Card", "Bank"];
    return SizedBox(
      height: 40,
      child: ListView(
        scrollDirection: Axis.horizontal,
        children: methods.map((m) => Padding(
          padding: const EdgeInsets.only(right: 8),
          child: ChoiceChip(
            label: Text(m),
            selected: _selectedMethod == m,
            onSelected: (val) => setState(() => _selectedMethod = m),
            backgroundColor: const Color(0xFF192D33),
            selectedColor: Theme.of(context).primaryColor,
          ),
        )).toList(),
      ),
    );
  }

  Widget _buildNotesInput() {
    return TextField(
      controller: _noteController,
      maxLines: 3,
      decoration: InputDecoration(
        hintText: "What did you buy?",
        filled: true,
        fillColor: const Color(0xFF192D33),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
      ),
    );
  }

  Widget _buildDatePicker() {
    return ListTile(
      tileColor: const Color(0xFF192D33),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      leading: const Icon(Icons.calendar_today, color: Colors.grey),
      title: Text(DateFormat('MMM dd, yyyy').format(_selectedDate)),
      onTap: () async {
        final picked = await showDatePicker(
          context: context,
          initialDate: _selectedDate,
          firstDate: DateTime(2020),
          lastDate: DateTime(2100),
        );
        if (picked != null) setState(() => _selectedDate = picked);
      },
    );
  }

  Widget _buildSaveButton() {
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: ElevatedButton(
        onPressed: () => Navigator.pop(context),
        style: ElevatedButton.styleFrom(
          backgroundColor: Theme.of(context).primaryColor,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        child: const Text("Save Expense", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      ),
    );
  }
}
