import { Component, computed, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { MatCardModule } from "@angular/material/card"
import { MatIconModule } from "@angular/material/icon"
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { Store } from "@ngrx/store"
import { NgxChartsModule } from "@swimlane/ngx-charts"
import { selectMusicStats, selectReportLoading, selectUserStats } from "../store/report.selectors"
import { loadReport } from "../store/report.actions"

@Component({
  selector: "app-report",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, NgxChartsModule],
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class ReportComponent {
  private store = inject(Store)

  userStats = this.store.selectSignal(selectUserStats)
  musicStats = this.store.selectSignal(selectMusicStats)
  loading = this.store.selectSignal(selectReportLoading)

  // Custom color scheme that matches our app theme
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };
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
        name: "Music Files ",
        series: music.map((m) => ({
          name: m.date,
          value: m.count,
        })),
      },
    ]
  })

  ngOnInit() {
    this.store.dispatch(loadReport())
  }
}
