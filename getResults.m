clear all;
clc;
close all;

global img_cache accept_idx
img_cache = {};
accept_idx = [];

% read table
T = readtable('sample_result.csv','Delimiter',',','ReadVariableNames',false);
a = T(1, 1).Variables;
if strcmp(string(a{1}), "HITId") == 1
    T = T(2:end, :);
end
row = 1;
f = figure; 
display_ui(f);
guidata(f, struct('row', row, 'result_table', T));
show_ann(T, row);

function display_ui(figure_handle)
    set(figure_handle, 'Units', 'Normalized', 'OuterPosition', [0 0 1 1]);
    set(figure_handle, 'Units', 'pixels');
    figure_size = get(figure_handle, 'position');
    set(figure_handle, 'WindowState', 'maximized');
    figure_width = figure_size(3);
    zone_width = 0.2 * figure_width;
    button_width = 0.15 * figure_width;
    buffer_width = 0.025 * figure_width;
    previous_pb = uicontrol(figure_handle,'Style','pushbutton','String','Previous',...
        'Position',[buffer_width 20 button_width 40],'ForegroundColor','black',...
        'BackgroundColor',[65, 172, 244]/255,'FontSize',14,'Callback',@previous_callback);
    next_pb = uicontrol(figure_handle,'Style','pushbutton','String','Next',...
        'Position',[zone_width+buffer_width 20 button_width 40],'ForegroundColor','black',...
        'BackgroundColor',[65, 172, 244]/255,'FontSize',14,'Callback',@next_callback);
    approve_pb = uicontrol(figure_handle,'Style','pushbutton','String','Approve',...
        'Position',[2*zone_width+buffer_width 20 button_width 40],'ForegroundColor','black',...
        'BackgroundColor',[255, 255, 255]/255,'FontSize',14,'Callback',@approve_callback);
    reject_pb = uicontrol(figure_handle,'Style','pushbutton','String','Reject',...
        'Position',[3*zone_width+buffer_width 20 button_width 40],'ForegroundColor','black',...
        'BackgroundColor',[255, 255, 255]/255,'FontSize',14,'Callback',@reject_callback);
    finish_pb = uicontrol(figure_handle,'Style','pushbutton','String','Finish and Export',...
        'Position',[4*zone_width+buffer_width 20 button_width 40],'ForegroundColor','black',...
        'BackgroundColor',[255, 177, 68]/255,'FontSize',14,'Callback',@finish_callback);
end

function next_callback(hObject, ~, ~)
    % get data from figure handle
    data = guidata(hObject);
    T = data.result_table;
    row = data.row;
    row = row + 1;
    guidata(gcf, struct('row', row, 'result_table', T));
    show_ann(T, row);
end

function previous_callback(hObject, ~, ~)
    data = guidata(hObject);
    T = data.result_table;
    row = data.row;
    row = row - 1;
    guidata(gcf, struct('row', row, 'result_table', T));
    show_ann(T, row);
end

function approve_callback(hObject, eventdata, ~)
    global accept_idx; 
    eventdata.Source.BackgroundColor = [65, 244, 97]/255;
    data = guidata(hObject);
    T = data.result_table;
    row = data.row;
    T(row, 33) = {'x'};
    T(row, 34) = {''};
    accept_idx = [accept_idx, row];
    guidata(hObject, struct('row', row, 'result_table', T));
    update_ui(T, row);
end

function reject_callback(hObject, eventdata, ~)
    global accept_idx; 
    eventdata.Source.BackgroundColor = [244, 65, 65]/255;
    data = guidata(hObject);
    T = data.result_table;
    row = data.row;
    T(row, 33) = {''};
    T(row, 34) = {'rejected'};
    accept_idx = accept_idx(accept_idx ~= row);
    guidata(hObject, struct('row', row, 'result_table', T));
    update_ui(T, row);
end

function finish_callback(hObject, ~, ~)
    data = guidata(hObject);
    T = data.result_table;
    folder = export_results(T);
    close gcf;
    fprintf("Annotation review finished. To change decisions, run this program again\n\n");
    fprintf("Masks saved to %s\n", strcat(folder, '\mask\'));
    fprintf("Images saved to %s\n", strcat(folder, '\image\'));
    fprintf("Review CSV exported to %s\n", strcat(folder, '\review.csv'));
end

function update_ui(T, row)
    approval = T(row, 33).Variables;
    approval = approval{1};
    rejection = T(row, 34).Variables;
    rejection = rejection{1};
    approve_pb = findobj('String', 'Approve');
    reject_pb = findobj('String', 'Reject');
    if strcmp(string(approval), "x")
        approve_pb.BackgroundColor = [65, 244, 97]/255;
        reject_pb.BackgroundColor = [255, 255, 255]/255;
    elseif strcmp(string(rejection), "rejected")
        approve_pb.BackgroundColor = [255, 255, 255]/255;
        reject_pb.BackgroundColor = [244, 65, 65]/255;
    else
        approve_pb.BackgroundColor = [255, 255, 255]/255;
        reject_pb.BackgroundColor = [255, 255, 255]/255;
    end
end

function show_ann(T, row)
    global img_cache;
    
    total = size(T, 1);
    row = mod(row, total);
    if (row == 0)
       row = total; 
    end
    update_ui(T, row);
    
    % get class name, img url, and annotation JSON struct
    class_names = strjoin(cellstr(table2cell(T(row, 30))));
    class_names = split(class_names, '-');
    class_num = length(class_names);
    img_url = strjoin(cellstr(table2cell(T(row, 28))));
    ann = jsondecode(strjoin(cellstr(table2cell(T(row, 32)))));

    % get cached image or download image from img url
    if (length(img_cache) < row)
        option = weboptions('Timeout', 10);
        img = webread(img_url, option);
        img_cache{end+1} = img;
    else
        img = img_cache{row};
    end

    % calculate the ratio between original image and the one displayed on Amazon MTurk
    scale = 1000/size(img, 2);
    img = imresize(img, scale);
    % hash class names and generate repeatable class colors
    colors = ones([class_num, 3]);
    for i = 1:class_num
       val = myHash(class_names{i}); 
       rng(val);
       hue = rand();
       hsv = [hue, 0.73, 1];
       colors(i, :) = hsv2rgb(hsv);
    end

    % display annotations as filled transparent polygons. Only supports polygons right now. 
    % TODO: Add support for dots and links. 
    for i = 1:size(ann, 1)
        if (strcmp(ann(i).mode, 'polygon'))
            coordinates = [];
            for j = 1:size(ann(i).data, 1)
                coordinates = [coordinates, ann(i).data(j, :)];
            end
            class_idx = 0;
            for j = 1:class_num
               if strcmp(ann(i).class, class_names(j))
                  class_idx = j; 
               end
            end
            if class_idx ~= 0
                img = insertShape(img, 'FilledPolygon', coordinates, 'Color', 255*colors(class_idx, :), 'Opacity', 0.5);
            end
        end
    end
    imshow(img);
end

function [val] = myHash(input_string)
   out_string = mlreportgen.utils.hash(input_string);
   hex_string = dec2hex(char(out_string));
   whole_hex_string = "";
   for i = 2:4
       whole_hex_string = strcat(whole_hex_string, hex_string(i, :));
   end
   val = str2double(whole_hex_string);
end

function save_path = export_results(T)
    save_path = strcat(pwd, '\', datestr(datenum(datetime('now')), 'dd-mmm-yyyy_HH-MM-SS'));
    mkdir(save_path);
    result_to_csv(T, strcat(save_path, '\review.csv'));
    save_mask_and_img(T, save_path);
end

function result_to_csv(T, file_path)
    column_names = ["HITId","HITTypeId","Title","Description","Keywords","Reward",...
        "CreationTime","MaxAssignments","RequesterAnnotation","AssignmentDurationInSeconds",...
        "AutoApprovalDelayInSeconds","Expiration","NumberOfSimilarHITs","LifetimeInSeconds",...
        "AssignmentId","WorkerId","AssignmentStatus","AcceptTime","SubmitTime","AutoApprovalTime",...
        "ApprovalTime","RejectionTime","RequesterFeedback","WorkTimeInSeconds","LifetimeApprovalRate",...
        "Last30DaysApprovalRate","Last7DaysApprovalRate","Input.img_url","Input.annotation_mode",...
        "Input.classes","Input.annotations","Answer.coordinates","Approve","Reject"];
    fid = fopen(file_path,'w');
    format_string = "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n";
    fprintf(fid,format_string,column_names);
    for i = 1:size(T, 1)
        temp_string = T(i, :).Variables;
        fprintf(fid,format_string,process_cell(temp_string));
    end
    fclose(fid);
end

function b = process_cell(a)
    b = [];
    for i = 1:length(a)
       b = [b, string(escape_quote(a{i}))]; 
    end
end

function b = escape_quote(a)
    b = '';
    idx = 1;
    need_quotation = 0;
    for i = 1:length(a)
        b(idx) = a(i);
        if (a(i) == '"')
            need_quotation = 1;
            b = strcat(b, '""');
            idx = idx + 1;
        end
        idx = idx + 1;
    end
    if need_quotation == 1
       b = strcat('"', b, '"'); 
    end
end

function save_mask_and_img(T, save_path)
    global img_cache accept_idx
    
    mask_folder = strcat(save_path, '\mask');
    if ~exist(mask_folder, 'dir')
        mkdir(mask_folder);
    end
    
    img_folder = strcat(save_path, '\image');
    if ~exist(img_folder, 'dir')
        mkdir(img_folder);
    end

    for k = 1:length(accept_idx)
        row = accept_idx(k);
        
        % get class name, img url, and annotation JSON struct
        class_names = strjoin(cellstr(table2cell(T(row, 30))));
        class_names = split(class_names, '-');
        class_num = length(class_names);
        ann = jsondecode(strjoin(cellstr(table2cell(T(row, 32)))));

        % get accepted image from cache
        img = img_cache{row};

        % calculate the ratio between original image and the one displayed on Amazon MTurk
        scale = 1000/size(img, 2);
        img = imresize(img, scale);
        imwrite(img, strcat(img_folder, '\', string(row), '.png'));
        
        % hash class names and generate repeatable class colors
        colors = ones([class_num, 3]);
        for i = 1:class_num
           val = myHash(class_names{i}); 
           rng(val);
           hue = rand();
           hsv = [hue, 0.73, 1];
           colors(i, :) = hsv2rgb(hsv);
        end

        % display annotations as filled transparent polygons. Only supports polygons right now. 
        % TODO: Add support for dots and links. 
        for i = 1:size(ann, 1)
            if (strcmp(ann(i).mode, 'polygon'))
                coordinates = [];
                for j = 1:size(ann(i).data, 1)
                    coordinates = [coordinates, ann(i).data(j, :)];
                end
                class_idx = 0;
                for j = 1:class_num
                   if strcmp(ann(i).class, class_names(j))
                      class_idx = j; 
                   end
                end
                if class_idx ~= 0
                    img = zeros(size(img));
                    mask = insertShape(img, 'FilledPolygon', coordinates, ...
                        'Color', [255, 255, 255], 'Opacity', 1);
                    imwrite(mask, strcat(mask_folder, '\', 'row_', string(row), ...
                        '_instance_', string(i), '_class_', string(class_idx), '.png'));
                end
            end
        end
    end
end