import { Todo } from '@/models/type';
import { FetchCurrentWeatherResponse } from '@/services/weather.service';
import { Title } from '@/shared/components/title/title.component';
import { TodoItemComponent } from '@/shared/components/todo-item/todo-item.component';
import { WeatherStore } from '@/stores/weather.store';

import { Component, computed, inject } from '@angular/core';

@Component({
  selector: 'todo-page',
  standalone: true,
  imports: [TodoItemComponent, Title],
  templateUrl: './todo-page.component.html',
})
export class TodoPageComponent {
  private readonly weatherStore = inject(WeatherStore);

  readonly weather = computed<FetchCurrentWeatherResponse | undefined>(() =>
    this.weatherStore.currentWeather?.()
  );

  yet = 'まだ終わってない';
  finished = 'もうやった';

  todos: Todo[] = [
    { id: '1', title: '犬の餌やり', isFinished: true },
    { id: '2', title: '犬と遊ぶ', isFinished: true },
    { id: '3', title: 'しーちゃんに餌をあげる', isFinished: false },
    { id: '4', title: 'オタ活', isFinished: false },
    { id: '5', title: 'ライブに行く', isFinished: false },
    { id: '6', title: '氷川神社にお参りに行く', isFinished: true },
    { id: '7', title: '動画編集を完了する', isFinished: true },
    { id: '8', title: 'セーラームーンを観る', isFinished: false },
    { id: '9', title: '世界の中心で愛を叫ぶ', isFinished: false },
    {
      id: '10',
      title:
        'ビートたけしのバトルロワイヤルに参加して最後の一人になって島から脱出する',
      isFinished: false,
    },
    { id: '11', title: '家の掃除をする', isFinished: true },
    {
      id: '12',
      title: '3歳児の子供と一緒にアウトレイジを観る',
      isFinished: false,
    },
    {
      id: '13',
      title: '特攻服を着て、ちいかわランドに行く',
      isFinished: false,
    },
    { id: '13', title: 'クッキングパパを全巻読む', isFinished: true },
    {
      id: '14',
      title:
        'NIGHTMAREの日本武道館で使われた改造デコチャリに乗って、一休のオフィスに突撃したのちに会社の備品を全部ぶっ壊す',
      isFinished: false,
    },
    {
      id: '15',
      title: 'CTOなのにデジタルタトゥーを残したエンジニアを再炎上させる',
      isFinished: false,
    },
    {
      id: '16',
      title: 'ブリリアント・ジャーク新岡を半殺しにする',
      isFinished: true,
    },
    {
      id: '17',
      title: '会社のお金を横領する',
      isFinished: false,
    },
    {
      id: '18',
      title:
        '実家に帰った時にけっこんはまだなの？って聞いてくる年寄りに車で突っ込む',
      isFinished: true,
    },
  ];

  todos_yet = this.todos.filter((el) => el.isFinished);
  todos_finished = this.todos.filter((el) => !el.isFinished);

  // TODOを終える
  finishTodo(id: Todo['id']) {
    // 完了の項目に追加する
    const setData = this.todos_yet.find((el) => el.id === id);
    if (setData) this.todos_finished.push({ ...setData, isFinished: true });

    // 未完の項目から削除する
    this.todos_yet = this.todos_yet.filter((el) => el.id !== id);
  }

  // TODOを戻す
  returnTodo(id: Todo['id']) {
    // 完了の項目に追加する
    const setData = this.todos_finished.find((el) => el.id === id);
    if (setData) this.todos_yet.push({ ...setData, isFinished: false });

    // 未完の項目から削除する
    this.todos_finished = this.todos_finished.filter((el) => el.id !== id);
  }
}
