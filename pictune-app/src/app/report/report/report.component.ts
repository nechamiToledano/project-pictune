import { Component, computed, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatSelectModule } from "@angular/material/select"
import { MatInputModule } from "@angular/material/input"
import { MatSlideToggleModule } from "@angular/material/slide-toggle"
import { MatButtonModule } from "@angular/material/button"
import { MatTabsModule } from "@angular/material/tabs"
import { MatGridListModule } from "@angular/material/grid-list"
import { MatDividerModule } from "@angular/material/divider"
import { MatTooltipModule } from "@angular/material/tooltip"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Store } from "@ngrx/store"
import { NgxChartsModule, ScaleType } from "@swimlane/ngx-charts"
import { loadReport } from "../store/report.actions"
import { selectMusicStats, selectReportLoading, selectUserStats } from "../store/report.selectors"
import type { Color } from "@swimlane/ngx-charts"

// Color schemes for charts
const COLOR_SCHEMES: { [key: string]: Color } = {
  vivid: {
    name: "vivid",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      "#647c8a",
      "#3f51b5",
      "#2196f3",
      "#00b862",
      "#afdf0a",
      "#a7b61a",
      "#f3e562",
      "#ff9800",
      "#ff5722",
      "#ff4514",
    ],
  },
  natural: {
    name: "natural",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      "#bf9d76",
      "#e99450",
      "#d89f59",
      "#f2dfa7",
      "#a5d7c6",
      "#7794b1",
      "#afafaf",
      "#707160",
      "#ba9383",
      "#d9d5c3",
    ],
  },
  cool: {
    name: "cool",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      "#a8385d",
      "#7aa3e5",
      "#a27ea8",
      "#aae3f5",
      "#adcded",
      "#a95963",
      "#8796c0",
      "#7ed3ed",
      "#50abcc",
      "#ad6886",
    ],
  },
  fire: {
    name: "fire",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      "#ff3d00",
      "#ff6e40",
      "#ff9e80",
      "#d84315",
      "#bf360c",
      "#ff5722",
      "#e64a19",
      "#f4511e",
      "#ffccbc",
      "#ffab91",
    ],
  },
  nightLights: {
    name: "nightLights",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      "#4e31a5",
      "#9c25a7",
      "#3065ab",
      "#57468b",
      "#904497",
      "#46648b",
      "#32118d",
      "#a00fb3",
      "#1052a2",
      "#6e51bd",
    ],
  },
}

// Chart type options
const CHART_TYPES = {
  primary: [
    { value: "line", label: "Line Chart" },
    { value: "bar", label: "Bar Chart" },
    { value: "pie", label: "Pie Chart" },
    { value: "area", label: "Area Chart" },
  ],
  secondary: [
    { value: "bar", label: "Bar Chart" },
    { value: "pie", label: "Pie Chart" },
    { value: "line", label: "Line Chart" },
    { value: "heatmap", label: "Heat Map" },
  ],
}

@Component({
  selector: "app-report",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatTabsModule,
    MatGridListModule,
    MatDividerModule,
    MatTooltipModule,
    NgxChartsModule,
  ],
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent implements OnInit {
  private store = inject(Store)
  private snackBar = inject(MatSnackBar)

  // Data selectors
  userStats = this.store.selectSignal(selectUserStats)
  musicStats = this.store.selectSignal(selectMusicStats)
  loading = this.store.selectSignal(selectReportLoading)

  // Chart configuration
  chartTypes = CHART_TYPES
  primaryChartType = "line"
  secondaryChartType = "bar"
  selectedColorScheme: keyof typeof COLOR_SCHEMES = "vivid"
  colorScheme: Color = COLOR_SCHEMES["vivid"]
  showLabels = true
  showLegend = true
  animations = true
  chartHeight = 400
  timeRange: "week" | "month"| "year" = "month"

  // Dashboard layout
  selectedTabIndex = 0
  dashboardView = "tabs" // 'tabs' or 'grid'
  cols = 2
  rowHeight = "1:1"

  // Mock data for secondary charts
  genreData = [
    { name: "Pop", value: 45 },
    { name: "Rock", value: 30 },
    { name: "Hip Hop", value: 15 },
    { name: "Electronic", value: 10 },
    { name: "Jazz", value: 8 },
    { name: "Classical", value: 7 },
  ]

  activityData = [
    { name: "Sunday", series: this.generateHourlyData() },
    { name: "Monday", series: this.generateHourlyData() },
    { name: "Tuesday", series: this.generateHourlyData() },
    { name: "Wednesday", series: this.generateHourlyData() },
    { name: "Thursday", series: this.generateHourlyData() },
    { name: "Friday", series: this.generateHourlyData() },
    { name: "Saturday", series: this.generateHourlyData() },
  ]

  // Primary chart data
  chartData = computed(() => {
    const users = this.userStats()
    const music = this.musicStats()

    if (!users || !music) {
      return []
    }

    return [
      {
        name: "Users",
        series: users.map((u) => ({
          name: u.date,
          value: u.count,
        })),
      },
      {
        name: "Music Files",
        series: music.map((m) => ({
          name: m.date,
          value: m.count,
        })),
      },
    ]
  })

  // Total counts for pie chart
  totalsByType = computed(() => {
    const users = this.userStats()
    const music = this.musicStats()

    if (!users || !music) {
      return []
    }

    const totalUsers = users.reduce((sum, u) => sum + u.count, 0)
    const totalMusic = music.reduce((sum, m) => sum + m.count, 0)

    return [
      { name: "Users", value: totalUsers },
      { name: "Music Files", value: totalMusic },
    ]
  })

  // Ratio data for secondary chart
  ratioData = computed(() => {
    const users = this.userStats()
    const music = this.musicStats()

    if (!users || !music) {
      return []
    }

    // Create a map of dates to user counts
    const userMap = new Map<string, number>()
    users.forEach((u) => userMap.set(u.date, u.count))

    // Calculate ratio of music files to users for each date
    return music
      .filter((m) => userMap.has(m.date) && userMap.get(m.date)! > 0)
      .map((m) => ({
        name: m.date,
        value: +(m.count / userMap.get(m.date)!).toFixed(2),
      }))
  })

  // Growth data for line chart
  growthData = computed(() => {
    const users = this.userStats()
    const music = this.musicStats()

    if (!users || !music || users.length < 2 || music.length < 2) {
      return []
    }

    // Calculate growth percentage for users and music
    const userGrowth = users.slice(1).map((u, i) => {
      const prevCount = users[i].count || 1 // Avoid division by zero
      const growthPercent = ((u.count - prevCount) / prevCount) * 100
      return {
        name: u.date,
        value: +growthPercent.toFixed(1),
      }
    })

    const musicGrowth = music.slice(1).map((m, i) => {
      const prevCount = music[i].count || 1 // Avoid division by zero
      const growthPercent = ((m.count - prevCount) / prevCount) * 100
      return {
        name: m.date,
        value: +growthPercent.toFixed(1),
      }
    })

    return [
      { name: "User Growth", series: userGrowth },
      { name: "Music File Growth", series: musicGrowth },
    ]
  })

  // Add a new property to track the expanded state of the settings panel
  settingsExpanded = false

  ngOnInit() {
    this.loadReportData()
  }

  loadReportData() {
    this.store.dispatch(loadReport({ timeRange: this.timeRange }))
  }

  updateChartSettings() {
    // This method would be called when chart settings change
    // In a real app, you might want to save user preferences
  }

  updateColorScheme() {
    this.colorScheme = COLOR_SCHEMES[this.selectedColorScheme]
  }

  toggleDashboardView() {
    this.dashboardView = this.dashboardView === "tabs" ? "grid" : "tabs"
  }

  exportData(format: "pdf" | "excel" | "image") {
    // In a real app, this would trigger an actual export
    this.snackBar.open(`Exporting data in ${format} format...`, "Close", {
      duration: 3000,
    })
  }

  // Helper method to generate random hourly data for heatmap
  private generateHourlyData() {
    const hours = []
    for (let i = 0; i < 24; i++) {
      hours.push({
        name: `${i}:00`,
        value: Math.floor(Math.random() * 100),
      })
    }
    return hours
  }

  // Add a method to toggle the settings panel
  toggleSettings(): void {
    this.settingsExpanded = !this.settingsExpanded
  }
}
