import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors, Spacing, Typography, getTextFontFamily } from "../constants/theme";
import { useColorScheme } from "../hooks/use-color-scheme";
import { usePreferences } from "../contexts/PreferencesContext";
import {
  JALALI_MONTHS,
  JALALI_WEEKDAYS_SHORT,
  fromJalali,
  jalaliDaysInMonth,
  jsWeekdayToPersian,
  todayJalali,
  toPersianDigits,
} from "../services/jalali";

export function PersianCalendar() {
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { language } = usePreferences();
  const boldFont = getTextFontFamily(language, "bold");
  const regularFont = getTextFontFamily(language, "normal");

  const [todayJ] = useState(() => todayJalali());
  const [viewYear, setViewYear] = useState(todayJ[0]);
  const [viewMonth, setViewMonth] = useState(todayJ[1]);

  const { cells, startOffset } = useMemo(() => {
    const days = jalaliDaysInMonth(viewYear, viewMonth);
    const [gy, gm, gd] = fromJalali(viewYear, viewMonth, 1);
    const firstDate = new Date(gy, gm - 1, gd);
    const offset = jsWeekdayToPersian(firstDate.getDay());
    return { cells: days, startOffset: offset };
  }, [viewYear, viewMonth]);

  function prevMonth() {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1); }
    else setViewMonth(m => m + 1);
  }

  const isToday = (day: number) =>
    viewYear === todayJ[0] && viewMonth === todayJ[1] && day === todayJ[2];

  const totalCells = startOffset + cells;
  const rows = Math.ceil(totalCells / 7);

  return (
    <View
      style={{
        backgroundColor: colorScheme === "dark" ? "rgba(24,33,47,0.96)" : "#FFFFFF",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: palette.borderLight,
        padding: Spacing.md,
        marginHorizontal: 0,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: Spacing.md }}>
        <Pressable
          onPress={nextMonth}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Feather name="chevron-left" size={20} color={palette.textSecondary} />
        </Pressable>

        <Text style={{ fontSize: Typography.sizes.body, fontWeight: Typography.fontWeight.bold, color: palette.textPrimary, fontFamily: boldFont }}>
          {JALALI_MONTHS[viewMonth - 1]} {toPersianDigits(viewYear)}
        </Text>

        <Pressable
          onPress={prevMonth}
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Feather name="chevron-right" size={20} color={palette.textSecondary} />
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View style={{ flexDirection: "row", marginBottom: Spacing.xs }}>
        {JALALI_WEEKDAYS_SHORT.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{
              fontSize: Typography.sizes.caption,
              fontWeight: Typography.fontWeight.semibold,
              color: i === 6 ? palette.primary : palette.textSecondary,
              fontFamily: regularFont,
            }}>
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      {Array.from({ length: rows }).map((_, row) => (
        <View key={row} style={{ flexDirection: "row" }}>
          {Array.from({ length: 7 }).map((_, col) => {
            const cellIndex = row * 7 + col;
            const day = cellIndex - startOffset + 1;
            const valid = day >= 1 && day <= cells;
            const today = valid && isToday(day);
            const isFriday = col === 6;

            return (
              <View key={col} style={{ flex: 1, alignItems: "center", paddingVertical: 3 }}>
                {valid ? (
                  <View style={today ? {
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: palette.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  } : { width: 30, height: 30, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{
                      fontSize: Typography.sizes.bodySecondary,
                      fontWeight: today ? Typography.fontWeight.bold : Typography.fontWeight.normal,
                      color: today ? palette.textOnPrimary : isFriday ? palette.primary : palette.textPrimary,
                      fontFamily: today ? boldFont : regularFont,
                    }}>
                      {toPersianDigits(day)}
                    </Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}

      {/* Gregorian equivalent footer */}
      <View style={{ marginTop: Spacing.sm, borderTopWidth: 1, borderTopColor: palette.borderLight, paddingTop: Spacing.sm }}>
        <Text style={{ fontSize: Typography.sizes.caption, color: palette.textSecondary, textAlign: "center", fontFamily: regularFont }}>
          {JALALI_MONTHS[viewMonth - 1]} {toPersianDigits(viewYear)} ← {(() => {
            const [gy, gm] = fromJalali(viewYear, viewMonth, 1);
            return new Date(gy, gm - 1, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
          })()}
        </Text>
      </View>
    </View>
  );
}
