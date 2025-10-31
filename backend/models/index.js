import User from "./user.js";
import Event from "./event.js";
import Booking from "./booking.js";
import Category from "./category.js";
import Payment from "./payment.js";
import Feedback from "./feedback.js";

// User <-> Event (One-to-Many, only organizers create events)
User.hasMany(Event, { foreignKey: "created_by", onDelete: "CASCADE" });
Event.belongsTo(User, { foreignKey: "created_by" });

// Category <-> Event (One-to-Many)
Category.hasMany(Event, { foreignKey: "category_id", onDelete: "SET NULL" });
Event.belongsTo(Category, { foreignKey: "category_id" });

// User <-> Booking (One-to-Many)
User.hasMany(Booking, { foreignKey: "user_id", onDelete: "CASCADE" });
Booking.belongsTo(User, { foreignKey: "user_id" });

//  Event <-> Booking (One-to-Many)
Event.hasMany(Booking, { foreignKey: "event_id", onDelete: "CASCADE" });
Booking.belongsTo(Event, { foreignKey: "event_id" });

//  Booking <-> Payment (One-to-One)
Booking.hasOne(Payment, { foreignKey: "booking_id", onDelete: "CASCADE" });
Payment.belongsTo(Booking, { foreignKey: "booking_id" });

// Feedback ↔ User ↔ Event
User.hasMany(Feedback, { foreignKey: "userId", onDelete: "CASCADE" });
Event.hasMany(Feedback, { foreignKey: "event_id", onDelete: "CASCADE" });
Feedback.belongsTo(User, { foreignKey: "userId" });
Feedback.belongsTo(Event, { foreignKey: "event_id" });

export { User, Event, Booking, Category, Payment };
