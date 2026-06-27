/**
 * JSON-LD 结构化数据渲染组件
 * 将 Schema.org 对象序列化为 <script type="application/ld+json">
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}
