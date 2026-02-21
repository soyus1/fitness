from django.views.generic import ListView


def get_pages_range(frame_size, number_of_pages, current_page):
    """
    Функция, возвращающая диапазон страниц (Для правильной пагинации)
    То есть, если делать пагинацию напрямую, то мы получим, при наличии большого множества данных, ужасно большой постраничный навигатор.
    Этот метод выдает диапазон, оптимальный для отображения, скрывая часть кнопок.

    :param frame_size: Размер фрейма (Для отступов от среднего значения)
    :param number_of_pages: Общее количество страниц
    :param current_page: Текущая страница
    :return: Диапазон значений, выводимых в качестве пагинатора в шаблоне
    """
    output = {}
    if number_of_pages <= frame_size:
        output['pages'] = range(1, number_of_pages + 1)
    else:
        output['pages'] = range(max(current_page - frame_size + 1, 1),
                                min(current_page + frame_size, number_of_pages + 1))
    return output['pages']


class PagedListView(ListView):
    """
    ListView с нормальным пагинатором (Высчитывается диапазон)
    """
    paginate_by = 10
    allow_empty = True

    # Размер фрейма для пагинатора (Суммарное количество элементов с каждой стороны)
    pagination_frame_size = 4

    def get_context_data(self, **kwargs):
        context = super(PagedListView, self).get_context_data(**kwargs)

        if self.paginate_by:
            context['pages_range'] = get_pages_range(self.pagination_frame_size,
                                                     context['paginator'].num_pages,
                                                     context['page_obj'].number)
            context['num_pages'] = context['paginator'].num_pages

        return context

