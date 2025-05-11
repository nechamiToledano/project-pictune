import { AuthEffects } from '../auth/store/auth.effects';
import { MusicFileEffects } from '../music-files/store/music-file.effects';
import { PlaylistEffects } from '../playlists/store/playlist.effects';
import { ReportEffects } from '../report/store/report.effects';
import { UserEffects } from '../users/store/user.effects';

export const appEffects = [AuthEffects,UserEffects,MusicFileEffects,PlaylistEffects,ReportEffects];
