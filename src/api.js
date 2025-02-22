import { create } from 'apisauce';
import config from 'config';
import { authToken } from 'utils/nick';

let baseURL = config.api;
const api = create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    Authorization: authToken(),
  },
  timeout: 10000,
});

const apiUpload = create({
  baseURL: config.url,
  headers: {
    Accept: '*/*',
    'Cache-Control': 'no-cache',
    Authorization: authToken(),
  },
  timeout: 60000,
});

export const setApiAuth = authToken => {
  api.setHeader('Authorization', authToken);
};

// replays
export const ReplayComment = replayIndex =>
  api.get(`replay_comment/${replayIndex}`);
export const AddReplayComment = data => api.post(`replay_comment/add`, data);
export const AllReplayComments = () => api.get('replay_comment/');
export const ReplayRating = replayIndex =>
  api.get(`replay_rating/${replayIndex}`);
export const AddReplayRating = data => api.post(`replay_rating/add`, data);
export const ReplayDrivenBy = kuskiIndex =>
  api.get(`replay/driven_by/${kuskiIndex}`);
export const ReplayUploadedBy = kuskiIndex =>
  api.get(`replay/uploaded_by/${kuskiIndex}`);
export const ReplayByUUID = UUID => api.get(`replay/byUUID/${UUID}`);
export const ReplaysSearchByDriven = data =>
  api.get(`replay/search/byDriven/${data.q}/${data.offset}`);
export const ReplaysSearchByLevel = data =>
  api.get(`replay/search/byLevel/${data.q}/${data.offset}`);
export const ReplaysSearchByFilename = data =>
  api.get(`replay/search/byFilename/${data.q}/${data.offset}`);
export const ReplaysByLevelIndex = LevelIndex =>
  api.get(`replay/byLevelIndex/${LevelIndex}`);
export const InsertReplay = data => api.post('replay', data);
export const UpdateReplay = data => api.post('replay/update', data);
export const Replays = ({ page, pageSize, tags, sortBy, order }) => {
  return api.get(`replay`, {
    page,
    pageSize,
    tags,
    sortBy,
    order,
  });
};

// country
export const Country = () => api.get('country');

// login
export const Register = data => api.post('register', data);
export const Confirm = data => api.post('register/confirm', data);
export const ResetPasswordConfirm = data =>
  api.post('register/resetconfirm', data);
export const ResetPassword = data => api.post('register/reset', data);
export const DiscordAuthUrl = data => api.post('/register/discord', data);
export const DiscordCode = data => api.post('/register/discord/code', data);
export const DiscordRemove = () => api.post('/register/discord/remove');

// cups
export const Cups = () => api.get('cups');
export const CupsOngoing = () => api.get('cups/ongoing');
export const Cup = shortName => api.get(`cups/${shortName}`);
export const CupEvents = cupGroupIndex =>
  api.get(`cups/events/${cupGroupIndex}`);
export const CupEvent = data =>
  api.get(`cups/event/${data.cupGroupIndex}/${data.cupIndex}`);
export const UpdateCup = (cupGroupIndex, data) =>
  api.post(`cups/edit/${cupGroupIndex}`, data);
export const UpdateCupBlog = data => api.post(`cups/blog/add`, data);
export const AddCup = data => api.post(`cups/add`, data);
export const AddEvent = (data, cupGroupIndex) =>
  api.post(`cups/${cupGroupIndex}/event/add`, data);
export const EditEvent = data =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.CupIndex}/edit`,
    data.event,
  );
export const DeleteEvent = data =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/delete`,
    data.event,
  );
export const GenerateEvent = data =>
  api.post(
    `cups/${data.CupGroupIndex}/event/${data.event.CupIndex}/generate`,
    data.event,
  );
export const SubmitInterview = data =>
  api.post(`cups/${data.CupGroupIndex}/event/${data.CupIndex}/interview`, data);
export const MyReplays = CupGroupIndex =>
  api.get(`cups/${CupGroupIndex}/myreplays`);
export const UpdateCupReplay = data =>
  api.post(`cups/${data.CupGroupIndex}/updatereplay`, data);
export const TeamReplays = CupGroupIndex =>
  api.get(`cups/${CupGroupIndex}/teamreplays`);
export const CupReplay = CupTimeIndex => api.get(`cups/time/${CupTimeIndex}`);

// kuski map
export const KuskiMap = () => api.get('kuskimap');
export const AddKuskiMap = data => api.post('kuskimap/add', data);

// allfinished
export const Highlight = () => api.get('allfinished/highlight');
export const PersonalAllFinished = data =>
  api.get(`allfinished/${data.LevelIndex}/${data.KuskiIndex}/${data.limit}`);
export const PersonalLatest = data =>
  api.get(`allfinished/${data.KuskiIndex}/${data.limit}`);
export const LeaderHistory = data => {
  const { from = '', to = '', KuskiIndex = '', BattleIndex = '' } = data;
  return api.get(
    `allfinished/leaderhistory/${data.LevelIndex}?from=${from}&to=${to}&KuskiIndex=${KuskiIndex}&BattleIndex=${BattleIndex}`,
  );
};
export const AllFinishedLevel = LevelIndex =>
  api.get(`allfinished/${LevelIndex}`);

// levelpack
export const LevelPacks = () => api.get('levelpack');
export const LevelPack = LevelPackName => api.get(`levelpack/${LevelPackName}`);
export const TotalTimes = data =>
  api.get(`levelpack/${data.levelPackIndex}/totaltimes/${data.eolOnly}`);
export const PersonalTimes = data =>
  api.get(
    `levelpack/${data.name}/personal/${data.PersonalKuskiIndex}/${data.eolOnly}`,
  );
export const PersonalWithMulti = data =>
  api.get(
    `levelpack/${data.name}/personalwithmulti/${data.PersonalKuskiIndex}/${data.eolOnly}`,
  );
export const LevelPackStats = data =>
  api.get(`levelpack/${data.name}/stats/${data.eolOnly}`);
export const MultiRecords = LevelPackName =>
  api.get(`levelpack/${LevelPackName}/multirecords`);
export const LevelPackSearch = q => api.get(`levelpack/search/${q}`);
export const LevelsSearch = data =>
  api.get(`levelpack/searchLevel/${data.q}/${data.offset}/${data.showLocked}`);
export const LevelsSearchAll = data =>
  api.get(`levelpack/searchLevel/${data.q}/${data.ShowLocked}`);
export const AddLevelPack = data => api.post('levelpack/add', data);
export const UpdateLevelPack = (index, data) =>
  api.post(`levelpack/update/${index}`, data);
export const LevelPackDeleteLevel = data =>
  api.post('levelpack/admin/deleteLevel', data);
export const LevelPackAddLevel = data =>
  api.post('levelpack/admin/addLevel', data);
export const LevelPackSortLevel = data =>
  api.post('levelpack/admin/sortLevel', data);
export const LevelPackSort = data => api.post('levelpack/admin/sort', data);
export const LevelPackFavAdd = data =>
  api.post('levelpack/favourite/add', data);
export const LevelPackFavRemove = data =>
  api.post('levelpack/favourite/remove', data);
export const LevelPackFavs = () => api.get('levelpack/favourite');

export const IntBestTimes = kuskiIndex => {
  return api.get(`levelpack/internals/besttimes/${kuskiIndex}`);
};

// collections
export const AddCollection = data =>
  api.post('levelpack/collections/add', data);
export const Collections = () => api.get('levelpack/collections');
export const Collection = name => api.get(`levelpack/collections/${name}`);
export const SearchPack = search =>
  api.get(`levelpack/collections/search/${search}`);
export const AddPack = data => api.post('levelpack/collections/addpack', data);
export const DeletePack = data =>
  api.post('levelpack/collections/deletepack', data);

// besttime
export const Besttime = data =>
  api.get(`besttime/${data.levelId}/${data.limit}/${data.eolOnly}`);
export const PersonalLatestPRs = data =>
  api.get(`besttime/latest/${data.KuskiIndex}/${data.limit}`);
export const MultiBesttime = data =>
  api.get(`besttime/multi/${data.levelId}/${data.limit}`);

// battles
export const BattlesSearchByFilename = data =>
  api.get(`battle/search/byFilename/${data.q}/${data.offset}`);
export const BattlesSearchByDesigner = data =>
  api.get(`battle/search/byDesigner/${data.q}/${data.offset}`);
export const BattlesByLevel = LevelIndex =>
  api.get(`battle/byLevel/${LevelIndex}`);
export const BattleResults = BattleIndex =>
  api.get(`battle/byBattleIndex/${BattleIndex}`);
export const BattleList = IndexList =>
  api.get(`battle/byBattleIndexList/${IndexList}`); // array of battle indices
export const GetAllBattleTimes = query =>
  api.get(`battle/allBattleTimes/${query}`);
export const BattlesByDesigner = data =>
  api.get(
    `battle/byDesigner/${data.KuskiIndex}?page=${data.page}&pageSize=${data.pageSize}`,
  );
export const BattlesByPlayer = data =>
  api.get(
    `battle/byPlayer/${data.KuskiIndex}?page=${data.page}&pageSize=${data.pageSize}`,
  );
export const AllBattleRuns = BattleIndex =>
  api.get(`battle/allRuns/${BattleIndex}`);
export const BattleListPeriod = data =>
  api.get(`battle/byPeriod/${data.start}/${data.end}/${data.limit}`);

// players
export const PlayersSearch = data =>
  api.get(`player/search/${data.q}/${data.offset}`);
export const TeamsSearch = data =>
  api.get(`player/searchTeam/${data.q}/${data.offset}`);
export const UserInfo = KuskiIndex => api.get(`player/${KuskiIndex}`);
export const UserInfoByIdentifier = data =>
  api.get(`player/${data.IdentifierType}/${data.KuskiIdentifier}`);
export const UpdateUserInfo = data => api.post(`register/update`, data);
export const Ignore = Kuski => api.post(`player/ignore/${Kuski}`);
export const Ignored = () => api.get('player/ignored');
export const Unignore = KuskiIndex => api.post(`player/unignore/${KuskiIndex}`);
export const Players = () => api.get('player/');
export const GetCrew = () => api.get('player/crew/');
export const NotificationSettings = () => api.get('player/settings');
export const ChangeSettings = data => api.post('player/settings', data);

// teams
export const Teams = () => api.get('teams');
export const TeamMembers = Team => api.get(`teams/${Team}`);

// chat
export const SearchChat = data => api.get('chatlog', { params: data });

// level
export const Level = LevelIndex => api.get(`level/${LevelIndex}`);
export const LevelData = LevelIndex => api.get(`level/leveldata/${LevelIndex}`);
export const LevelTimeStats = LevelIndex =>
  api.get(`level/timestats/${LevelIndex}`);
export const UpdateLevel = data =>
  api.post(`level/${data.LevelIndex}`, data.update);

// ranking
export const PersonalRanking = KuskiIndex =>
  api.get(`ranking/kuski/${KuskiIndex}`);
export const Ranking = data =>
  api.get(`ranking/${data.periodType}/${data.period}`);
export const RankingHistoryByBattle = BattleIndex =>
  api.get(`ranking/battle/${BattleIndex}`);

// mod
export const NickRequests = () => api.get(`mod/nickrequests`);
export const NickAccept = data =>
  api.post(`mod/nickrequests/accept/${data.SiteSettingIndex}`);
export const NickDecline = data =>
  api.post(`mod/nickrequests/decline/${data.SiteSettingIndex}`);
export const Banlist = () => api.get('mod/banlist');
export const BanlistKuski = KuskiIndex => api.get(`mod/banlist/${KuskiIndex}`);
export const BanKuski = data => api.post('mod/bankuski', data);
export const ErrorLog = data =>
  api.get(`mod/errorlog/${data.Kuski}/${data.ErrorTime}`);
export const ActionLog = data =>
  api.get(`mod/actionlog/${data.Kuski}/${data.ErrorTime}`);
export const GiveRights = data => api.post('mod/giverights', data);
export const IPlogs = KuskiIndex => api.get(`mod/iplogs/${KuskiIndex}`);

// news
export const News = amount => api.get(`news/${amount}`);
export const AddNews = data => api.post('news', data);

// donations
export const GetDonations = () => api.get(`donate/`);

// upload
export const UploadFile = data => apiUpload.post(`upload/file`, data);
export const UpdateFile = data => api.post(`upload`, data);

// tags
export const GetTags = () => api.get(`tag`);
export const CreateTag = data => api.post(`tag`, data);
export const UpdateTag = (TagIndex, data) => api.put(`tag/${TagIndex}`, data);
export const DeleteTag = TagIndex => api.delete(`tag/${TagIndex}`);

// notifications
export const GetNotifications = () => api.get(`notification`);
export const GetNotificationsCount = () => api.get(`notification/count`);
export const MarkNotificationsSeen = () => api.post(`notification/markSeen`);
