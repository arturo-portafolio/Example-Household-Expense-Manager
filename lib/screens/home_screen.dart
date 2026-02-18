
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(),
            const SizedBox(height: 30),
            _buildSummaryRow(),
            const SizedBox(height: 24),
            _buildInsightCard(context),
            const SizedBox(height: 30),
            _buildDonutChartCard(context),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            CircleAvatar(
              backgroundColor: const Color(0xFF13B6EC).withOpacity(0.1),
              child: const Icon(Icons.person, color: Color(0xFF13B6EC)),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Welcome back,", style: TextStyle(color: Colors.grey, fontSize: 12)),
                Text("Alex Johnson", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              ],
            )
          ],
        ),
        const Icon(Icons.notifications_outlined, color: Colors.grey),
      ],
    );
  }

  Widget _buildSummaryRow() {
    return Row(
      children: [
        _summaryItem("Today", "\$42.50", const Color(0xFF13B6EC).withOpacity(0.1)),
        const SizedBox(width: 12),
        _summaryItem("Month", "\$1,240", Colors.white.withOpacity(0.05)),
        const SizedBox(width: 12),
        _summaryItem("Year", "\$15.2k", Colors.white.withOpacity(0.05)),
      ],
    );
  }

  Widget _summaryItem(String label, String value, Color bgColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withOpacity(0.05)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label.toUpperCase(), style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildInsightCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: const Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("MONTHLY INSIGHT", style: TextStyle(color: Colors.white70, fontSize: 10, fontWeight: FontWeight.bold)),
                SizedBox(height: 4),
                Text("12% less spending compared to last month. Great job!", style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
              ],
            ),
          ),
          Icon(Icons.trending_down, color: Colors.white, size: 32),
        ],
      ),
    );
  }

  Widget _buildDonutChartCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF192D33),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text("Category Breakdown", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Text("This Month", style: TextStyle(color: Color(0xFF13B6EC), fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 40),
          SizedBox(
            height: 180,
            child: PieChart(
              PieChartData(
                sectionsSpace: 5,
                centerSpaceRadius: 60,
                sections: [
                  PieChartSectionData(color: const Color(0xFF13B6EC), value: 40, radius: 20, showTitle: false),
                  PieChartSectionData(color: const Color(0xFFF97316), value: 30, radius: 20, showTitle: false),
                  PieChartSectionData(color: const Color(0xFFA855F7), value: 15, radius: 20, showTitle: false),
                  PieChartSectionData(color: const Color(0xFF64748B), value: 15, radius: 20, showTitle: false),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
