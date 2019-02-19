function next_callback(hObject, eventdata, handles)
    % get data from figure
    data = guidata(hObject);
    T = data.result_table;
    row = data.row;
    row = row + 1;
    show_ann(T, row);
    guidata(hObject, struct('row', row, 'result_table', T));
end