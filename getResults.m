clear all;
clc;

% read table
T = readtable('sample_result.csv','Delimiter',',','ReadVariableNames',false);

row = 1;
f = figure; 
guidata(f, struct('row', row, 'result_table', T));
show_ann(T, row);
pb = uicontrol(f,'Style','pushbutton','String','Button 1','Position',[50 20 60 40],'Callback',@next_callback);
