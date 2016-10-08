package com.tangwy.ff14;

import android.util.Log;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.AxisValueFormatter;
import com.github.mikephil.charting.formatter.LargeValueFormatter;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.github.mikephil.charting.listener.OnChartValueSelectedListener;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by Troy Tang on 2016-10-3.
 */

public class LineChartManager extends ViewGroupManager<LineChart> {

    private static final String CLASS_NAME = "LineChart";
    private static final String COMMAND_RENDER_AVERAGE = "renderAverage";
    private static final String COMMOND_RENDER_COUNT = "renderCount";
    private static final String COMMOND_RENDER_TOTAL = "renderTotal";
    private static final int COMMOND_CODE_RENDER_AVERAGE = 1;
    private static final int COMMOND_CODE_RENDER_COUNT = 2;
    private static final int COMMOND_CODE_RENDER_TOTAL = 3;

//    LineChart instance = null;

    @Override
    public String getName() {
        return CLASS_NAME;
    }

    @Override
    protected LineChart createViewInstance(ThemedReactContext reactContext) {
        LineChart instance = new LineChart(reactContext);
        instance.setOnChartValueSelectedListener(new OnChartValueSelectedListener() {
            @Override
            public void onValueSelected(Entry e, Highlight h) {
                Log.i("VAL SELECTED",
                        "Value: " + e.getY() + ", xIndex: " + e.getX()
                                + ", DataSet index: " + h.getDataSetIndex());
            }

            @Override
            public void onNothingSelected() {
                // TODO Auto-generated method stub
            }
        });

        instance.setDrawGridBackground(false);
//        instance.getDescription().setEnabled(false);
        instance.setDescription("");
        instance.setDrawBorders(false);

        instance.getAxisLeft().setEnabled(true);
        instance.getAxisRight().setEnabled(false);
        instance.getAxisRight().setDrawAxisLine(false);
        instance.getAxisRight().setDrawGridLines(false);
        instance.getXAxis().setDrawAxisLine(false);
        instance.getXAxis().setDrawGridLines(false);
        instance.getXAxis().setLabelRotationAngle(0.0f);
        instance.getXAxis().setPosition(XAxis.XAxisPosition.BOTTOM);

        // enable touch gestures
        instance.setTouchEnabled(true);

        // enable scaling and dragging
        instance.setDragEnabled(true);
        instance.setScaleEnabled(true);

        // if disabled, scaling can be done on x- and y-axis separately
        instance.setPinchZoom(false);

        Legend l = instance.getLegend();
        l.setVerticalAlignment(Legend.LegendVerticalAlignment.TOP);
        l.setHorizontalAlignment(Legend.LegendHorizontalAlignment.RIGHT);
        l.setOrientation(Legend.LegendOrientation.VERTICAL);
        l.setDrawInside(false);

        return instance;
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
        return MapBuilder.of(COMMAND_RENDER_AVERAGE, COMMOND_CODE_RENDER_AVERAGE,
                COMMOND_RENDER_COUNT, COMMOND_CODE_RENDER_COUNT,
                COMMOND_RENDER_TOTAL, COMMOND_CODE_RENDER_TOTAL);
    }

    @Override
    public void receiveCommand(LineChart root, int commandId, @Nullable ReadableArray args) {
        super.receiveCommand(root, commandId, args);
        switch (commandId) {
            case COMMOND_CODE_RENDER_AVERAGE:
                setAverage(root, args);
                break;
            case COMMOND_CODE_RENDER_COUNT:
                setCount(root, args);
                break;
            case COMMOND_CODE_RENDER_TOTAL:
                setTotal(root, args);
                break;
        }
    }

    @ReactMethod
    public void setTotal(LineChart root, ReadableArray data) {
        if (data != null) {
            final ReadableArray tradeDates = data.getArray(0);
            ReadableArray totals = data.getArray(1);

            root.getXAxis().setValueFormatter(new AxisValueFormatter() {
                @Override
                public String getFormattedValue(float value, AxisBase axis) {
                    return tradeDates.getString((int) value).substring(5);
                }

                @Override
                public int getDecimalDigits() {
                    return 0;
                }
            });
            root.getAxisLeft().setValueFormatter(new LargeValueFormatter());

            List<Entry> totalList = new ArrayList<>();
            for (int i = 0; i < totals.size(); i++) {
                Entry entry = new Entry(i, (float) totals.getDouble(i));
                totalList.add(entry);
            }
            LineDataSet setCount = new LineDataSet(totalList, "总额");
            setCount.setAxisDependency(YAxis.AxisDependency.LEFT);

            // use the interface ILineDataSet
            List<ILineDataSet> dataSets = new ArrayList<>();
            dataSets.add(setCount);
            LineData lineData = new LineData(dataSets);
            root.setData(lineData);
            root.invalidate(); // refresh
        }
    }

    @ReactMethod
    public void setCount(LineChart root, ReadableArray data) {
        if (data != null) {
            final ReadableArray tradeDates = data.getArray(0);
            ReadableArray counts = data.getArray(1);

            root.getXAxis().setValueFormatter(new AxisValueFormatter() {
                @Override
                public String getFormattedValue(float value, AxisBase axis) {
                    return tradeDates.getString((int) value).substring(5);
                }

                @Override
                public int getDecimalDigits() {
                    return 0;
                }
            });

            List<Entry> countList = new ArrayList<>();
            for (int i = 0; i < counts.size(); i++) {
                Entry entry = new Entry(i, (float) counts.getDouble(i));
                countList.add(entry);
            }
            LineDataSet setCount = new LineDataSet(countList, "数量");
            setCount.setAxisDependency(YAxis.AxisDependency.LEFT);

            // use the interface ILineDataSet
            List<ILineDataSet> dataSets = new ArrayList<>();
            dataSets.add(setCount);
            LineData lineData = new LineData(dataSets);
            root.setData(lineData);
            root.invalidate(); // refresh
        }
    }

    @ReactMethod
    public void setAverage(LineChart root, ReadableArray data) {
        if (data != null) {
            final ReadableArray tradeDates = data.getArray(0);
            ReadableArray averages = data.getArray(1);
            ReadableArray peaks = data.getArray(2);
            ReadableArray bottoms = data.getArray(3);

            root.getXAxis().setValueFormatter(new AxisValueFormatter() {
                @Override
                public String getFormattedValue(float value, AxisBase axis) {
                    return tradeDates.getString((int) value).substring(5);
                }

                @Override
                public int getDecimalDigits() {
                    return 0;
                }
            });

            List<Entry> averageList = new ArrayList<>();
            for (int i = 0; i < averages.size(); i++) {
                Entry entry = new Entry(i, (float) averages.getDouble(i));
                averageList.add(entry);
            }
            LineDataSet setAverage = new LineDataSet(averageList, "平均");
            setAverage.setAxisDependency(YAxis.AxisDependency.LEFT);

            List<Entry> peakList = new ArrayList<>();
            for (int i = 0; i < peaks.size(); i++) {
                Entry entry = new Entry(i, (float) peaks.getDouble(i));
                peakList.add(entry);
            }
            LineDataSet setPeak = new LineDataSet(peakList, "最高");
            setPeak.setAxisDependency(YAxis.AxisDependency.LEFT);
            setPeak.setColors(new int[]{android.R.color.holo_red_dark}, MainApplication.getInstance());

            List<Entry> bottomList = new ArrayList<>();
            for (int i = 0; i < bottoms.size(); i++) {
                Entry entry = new Entry(i, (float) bottoms.getDouble(i));
                bottomList.add(entry);
            }
            LineDataSet setBottom = new LineDataSet(bottomList, "最低");
            setBottom.setAxisDependency(YAxis.AxisDependency.LEFT);
            setBottom.setColors(new int[]{android.R.color.holo_green_dark}, MainApplication.getInstance());

            // use the interface ILineDataSet
            List<ILineDataSet> dataSets = new ArrayList<>();
            dataSets.add(setAverage);
            dataSets.add(setPeak);
            dataSets.add(setBottom);
            LineData lineData = new LineData(dataSets);
            root.setData(lineData);
            root.invalidate(); // refresh
        }
    }
}
