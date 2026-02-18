
import 'package:hive/hive.dart';
import '../models.dart';

class StorageService {
  static final box = Hive.box<Transaction>('transactions');
  static final catBox = Hive.box<Category>('categories');

  static List<Transaction> getAllTransactions() {
    return box.values.toList()..sort((a, b) => b.date.compareTo(a.date));
  }

  static void addTransaction(Transaction t) {
    box.put(t.id, t);
  }

  static void deleteTransaction(String id) {
    box.delete(id);
  }

  static double getTodayTotal() {
    final now = DateTime.now();
    return box.values
        .where((t) => t.date.year == now.year && t.date.month == now.month && t.date.day == now.day)
        .fold(0, (sum, t) => sum + t.amount);
  }
}
