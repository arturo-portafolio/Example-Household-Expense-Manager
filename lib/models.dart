
import 'package:hive/hive.dart';

part 'models.g.dart';

@HiveType(typeId: 0)
class Transaction extends HiveObject {
  @HiveField(0)
  String id;
  @HiveField(1)
  double amount;
  @HiveField(2)
  String categoryId;
  @HiveField(3)
  DateTime date;
  @HiveField(4)
  String paymentMethod;
  @HiveField(5)
  String notes;
  @HiveField(6)
  bool isRecurring;
  @HiveField(7)
  String? photoPath;

  Transaction({
    required this.id,
    required this.amount,
    required this.categoryId,
    required this.date,
    required this.paymentMethod,
    this.notes = '',
    this.isRecurring = false,
    this.photoPath,
  });
}

@HiveType(typeId: 1)
class Category extends HiveObject {
  @HiveField(0)
  String id;
  @HiveField(1)
  String name;
  @HiveField(2)
  String icon;
  @HiveField(3)
  String colorHex;
  @HiveField(4)
  double limit;

  Category({
    required this.id,
    required this.name,
    required this.icon,
    required this.colorHex,
    required this.limit,
  });
}

@HiveType(typeId: 2)
class AppSettings extends HiveObject {
  @HiveField(0)
  String currency;
  @HiveField(1)
  bool isDarkMode;

  AppSettings({
    this.currency = 'USD',
    this.isDarkMode = true,
  });
}
