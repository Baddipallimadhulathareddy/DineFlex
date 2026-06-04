const db = require("../db");

exports.getInsights = async (req, res) => {
  const { adminId } = req.params;

  try {
    // Fetch dishes
    db.query(
      "SELECT * FROM dishes WHERE adminId=?",
      [adminId],
      (err, dishes) => {
        if (err) return res.status(500).json(err);

        // Fetch reservations
        db.query(
          "SELECT * FROM reservations WHERE adminId=?",
          [adminId],
          (err, reservations) => {
            if (err) return res.status(500).json(err);

            // Fetch tables
            db.query(
              "SELECT * FROM tables WHERE adminId=?",
              [adminId],
              (err, tables) => {
                if (err) return res.status(500).json(err);

                let sales = {};

                // Count sold dishes
                reservations.forEach((r) => {
                  try {
                    const ordered = JSON.parse(
                      r.dishes || "[]"
                    );

                    ordered.forEach((d) => {
                      const dish = dishes.find(
                        x =>
                          Number(x.id) ===
                          Number(d.dishId)
                      );

                      if (dish) {
                        sales[dish.name] =
                          (sales[dish.name] || 0) +
                          Number(d.quantity);
                      }
                    });
                  } catch {}
                });

                // High Selling
                let highSelling = null;
                let max = 0;

                Object.entries(sales).forEach(
                  ([name, sold]) => {
                    if (sold > max) {
                      max = sold;
                      highSelling = { name, sold };
                    }
                  }
                );

                // Low Selling
                let lowSelling = null;
                let min = Infinity;

                Object.entries(sales).forEach(
                  ([name, sold]) => {
                    if (sold < min) {
                      min = sold;
                      lowSelling = { name, sold };
                    }
                  }
                );

                // Low stock dishes
                const lowStock = dishes.filter(
                  d =>
                    Number(d.quantity) <=
                    Number(d.threshold)
                );

                // Table usage
                let tableCount = {};

                reservations.forEach((r) => {
                  tableCount[r.tableId] =
                    (tableCount[r.tableId] || 0) + 1;
                });

                let mostUsed = null;
                let maxUse = 0;

                Object.entries(tableCount).forEach(
                  ([tableId, usage]) => {
                    if (usage > maxUse) {
                      maxUse = usage;

                      const table = tables.find(
                        t =>
                          Number(t.id) ===
                          Number(tableId)
                      );

                      mostUsed = {
                        table:
                          table?.tableNumber || tableId,
                        usage
                      };
                    }
                  }
                );

                // Peak Day
                const days = {};

                reservations.forEach((r) => {
                  const day = new Date(
                    r.date
                  ).toLocaleDateString(
                    "en-US",
                    { weekday: "long" }
                  );

                  days[day] =
                    (days[day] || 0) + 1;
                });

                let peakDay = "No Data";
                let peakCount = 0;

                Object.entries(days).forEach(
                  ([day, count]) => {
                    if (count > peakCount) {
                      peakCount = count;
                      peakDay = day;
                    }
                  }
                );

                // Recommendations
                let recommendations = [];

                if (highSelling)
                  recommendations.push(
                    `Increase stock of ${highSelling.name}`
                  );

                if (lowSelling)
                  recommendations.push(
                    `Reduce stock of ${lowSelling.name}`
                  );

                if (lowStock.length > 0)
                  recommendations.push(
                    `Restock ${lowStock
                      .map((d) => d.name)
                      .join(", ")}`
                  );

                if (mostUsed)
                  recommendations.push(
                    `Add more chairs near table ${mostUsed.table}`
                  );

                recommendations.push(
                  `Peak traffic is on ${peakDay}`
                );

                res.json({
                  highSelling,
                  lowSelling,
                  lowStock,
                  tableUsage: mostUsed,
                  peakDay,
                  recommendations
                });
              }
            );
          }
        );
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }
};