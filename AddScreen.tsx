// AddScreen.tsx — вкладка «Додати»: швидка реєстрація витрати, поїздки, їжі чи іншої операції.
import { h, Fragment } from './dom.ts';
import type { Operation } from './types.ts';
import { Seg } from './ui.tsx';
import { ExpenseForm, MealForm, MoreForm, TripForm, addedToast } from './forms.tsx';
import { derived, go, setUI, ui, type AddMode } from './view.ts';

export function AddScreen(): Node {
  const { today } = derived();
  const preset = ui.addPreset;
  const mode: AddMode = preset?.mode ?? ui.addMode;
  const date = preset?.date ?? today;
  const done = (op: Operation | null) => {
    ui.addPreset = null;
    if (!op) return;
    addedToast(op);
    go('day', { dayDate: op.date === today ? null : op.date });
  };
  const hints: Record<AddMode, string> = {
    expense: 'Категорія, сума, «Зберегти» — три дотики.',
    trip: 'Спосіб, вартість і час — для порівняння «Як їхати вигідніше?».',
    meal: 'Домашній обід чи їдальня — без подвійного обліку продуктів.',
    more: 'Дохід, повернення, переказ у накопичення чи між рахунками.',
  };
  return (
    <div class="screen add">
      <header class="screen-head">
        <h1 class="h1">Додати</h1>
        <p class="kicker">{hints[mode]}</p>
      </header>
      <Seg value={mode} label="Що додати" options={[
        { value: 'expense', label: 'Витрата' },
        { value: 'trip', label: 'Поїздка' },
        { value: 'meal', label: 'Їжа' },
        { value: 'more', label: 'Інше' },
      ]} onChange={(v) => setUI({ addMode: v, addPreset: null })} />
      {mode === 'expense' ? <ExpenseForm date={date} category={preset?.category} onDone={done} />
        : mode === 'trip' ? <TripForm date={date} onDone={done} />
        : mode === 'meal' ? <MealForm date={date} onDone={done} />
        : <MoreForm date={date} kind={preset?.more} onDone={done} />}
    </div>
  );
}
