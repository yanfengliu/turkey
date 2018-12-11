clear all;
clc;

T = readtable('sample_result.csv','Delimiter',',','ReadVariableNames',false);
class_names = strjoin(cellstr(table2cell(T(1, 30))));
class_names = split(class_names, '-');
class_num = length(class_names);
img_url = strjoin(cellstr(table2cell(T(1, 28))));
ann = jsondecode(strjoin(cellstr(table2cell(T(1, 31)))));
option = weboptions('Timeout', 10);
img = webread(img_url);
figure; hold on;
ratio = size(img, 2)/1000;
% hash class names and generate repeatable class colors
colors = ones([class_num, 3]);
for i = 1:class_num
   val = myHash(class_names{i}); 
   rng(val);
   hue = rand();
   hsv = [hue, 1, 1];
   colors(i, :) = hsv2rgb(hsv);
end
for i = 1:size(ann, 1)
    if (strcmp(ann(i).mode, 'polygon'))
        coordinates = [];
        for j = 1:size(ann(i).data, 1)
            coordinates = [coordinates, ratio*ann(i).data(j, :)];
        end
        class_idx = 0;
        for j = 1:class_num
           if strcmp(ann(i).class, class_names(j))
              class_idx = j; 
           end
        end
        img = insertShape(img, 'FilledPolygon', coordinates, 'Color', 255*colors(class_idx, :), 'Opacity', 0.5);
    end
end
legend('soybean', 'corn', 'palmer');
imshow(img);
